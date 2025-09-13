"""
Voice call handling router for appointment booking system.
Handles audio transcription, conversation management, and appointment booking via voice.
"""
from fastapi import APIRouter, Depends, UploadFile, File, Form
from errors import bad_request_error, internal_server_error
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import logging
from datetime import datetime, timedelta, date, time
import tempfile
import os
import json

from database import get_db, VoiceSession
from sqlalchemy.orm import Session
from auth import get_current_active_user
from ai_service import ai_service
from providers.assemblyai_provider import AssemblyAIProvider
from providers.twilio_provider import TwilioProvider
from google_calendar import GoogleCalendarClient
from database import User as UserModel
from config import settings

router = APIRouter(prefix="/api/voice", tags=["voice"])
logger = logging.getLogger(__name__)

# Initialize services
assemblyai_provider = AssemblyAIProvider()
calendar_service = GoogleCalendarClient()
twilio_provider = TwilioProvider()

class VoiceCallRequest(BaseModel):
    audio_url: Optional[str] = None
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class VoiceCallResponse(BaseModel):
    transcription: Optional[str] = None
    response: str
    session_id: str
    next_action: Optional[str] = None
    timestamp: datetime

# Helper functions for session management
async def get_or_create_voice_session(session_id: str, user_id: int, db) -> VoiceSession:
    """Get existing voice session or create a new one."""
    session = db.query(VoiceSession).filter(
        VoiceSession.session_id == session_id,
        VoiceSession.user_id == user_id,
        VoiceSession.is_active == True
    ).first()
    
    if not session:
        # Create new session with 1-hour expiration
        expires_at = datetime.now() + timedelta(hours=1)
        session = VoiceSession(
            session_id=session_id,
            user_id=user_id,
            current_state="init",
            context={},
            conversation_history=[],
            is_active=True,
            expires_at=expires_at
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    
    return session

async def update_voice_session(session: VoiceSession, state: str, context: Dict[str, Any],
                              user_message: Optional[str] = None, ai_response: Optional[str] = None, db=None):
    """Update voice session with new state, context, and conversation history."""
    session.current_state = state
    session.context = context
    session.updated_at = datetime.now()
    
    # Add to conversation history if messages provided
    if user_message:
        session.conversation_history.append({
            "role": "user",
            "message": user_message,
            "timestamp": datetime.now().isoformat()
        })
    
    if ai_response:
        session.conversation_history.append({
            "role": "assistant",
            "message": ai_response,
            "timestamp": datetime.now().isoformat()
        })
    
    if db:
        db.commit()
        db.refresh(session)
    
    return session

async def send_fallback_notification(user_id: int, message: str, db, fallback_type: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Send fallback notification via SMS/WhatsApp if voice communication fails."""
    try:
        # Get user's phone number from database
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user or not user.phone_number:
            logger.warning(f"Cannot send fallback message: no phone number for user {user_id}")
            return None
        
        # Use Twilio provider to send fallback message
        return await twilio_provider.send_fallback_message(user.phone_number, message, fallback_type)
        
    except Exception as e:
        logger.error(f"Fallback notification failed for user {user_id}: {str(e)}")
        return None

async def build_conversation_prompt(transcription: str, session: VoiceSession) -> str:
    """Build a comprehensive prompt for AI with conversation history and context."""
    conversation_history = "\n".join(
        [f"{msg['role']}: {msg['message']}" for msg in session.conversation_history[-10:]]  # Last 10 messages
    )
    
    prompt = f"""You are an AI appointment booking assistant. Continue the conversation with the user.

Current conversation state: {session.current_state}
Collected information so far: {json.dumps(session.context, indent=2)}

Conversation history:
{conversation_history}

User's latest message: "{transcription}"

Your role is to help users book appointments via voice. Follow this workflow:
1. Greet the user warmly and identify the purpose of the call
2. Ask for desired date, time, and type of appointment
3. Check calendar availability if needed
4. Confirm details and save booking when ready
5. Provide confirmation and next steps

Respond naturally and continue the conversation based on the current state and history.
"""
    return prompt

@router.post("/transcribe", response_model=VoiceCallResponse)
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    session_id: Optional[str] = Form(None),
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Transcribe audio from an uploaded file and initiate appointment booking conversation.
    """
    try:
        # Save uploaded audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            content = await audio_file.read()
            temp_audio.write(content)
            temp_audio_path = temp_audio.name

        try:
            # Transcribe audio using AssemblyAI
            transcription = await assemblyai_provider.transcribe_audio(temp_audio_path)
            
            # Generate session ID if not provided
            if not session_id:
                session_id = f"voice_session_{datetime.now().timestamp()}_{current_user.id}"
            
            # Get or create voice session
            session = await get_or_create_voice_session(session_id, current_user.id, db)
            
            # Build comprehensive prompt with conversation history
            prompt = await build_conversation_prompt(transcription, session)
            
            # Process the transcription with AI for appointment booking
            ai_response = await ai_service.generate_text(
                prompt,
                user_id=current_user.id
            )
            
            # Update session with new conversation and context
            # Extract and update context from AI response if possible
            new_context = session.context.copy()
            # Simple context extraction - can be enhanced with more sophisticated parsing
            if "date" in ai_response.lower() and "time" in ai_response.lower():
                new_context["awaiting_datetime"] = True
            elif "confirm" in ai_response.lower():
                new_context["ready_to_confirm"] = True
            
            session = await update_voice_session(
                session,
                session.current_state,
                new_context,
                transcription,
                ai_response,
                db
            )
            
            # Determine next action based on AI response and context
            next_action = "continue_conversation"
            if session.context.get("ready_to_confirm"):
                next_action = "confirm_booking"
            elif session.context.get("awaiting_datetime"):
                next_action = "get_appointment_details"
            
            return VoiceCallResponse(
                transcription=transcription,
                response=ai_response,
                session_id=session_id,
                next_action=next_action,
                timestamp=datetime.now()
            )
            
        finally:
            # Clean up temporary file
            os.unlink(temp_audio_path)
            
    except Exception as e:
        logger.error(f"Audio transcription error: {str(e)}")
        
        # Attempt fallback notification
        fallback_message = "We're having trouble with voice communication. Please continue via text message."
        fallback_result = await send_fallback_notification(current_user.id, fallback_message, db)
        
        if fallback_result:
            logger.info(f"Fallback notification sent successfully via {fallback_result.get('channel')}")
            raise internal_server_error(
                "Voice processing failed. A fallback message has been sent to your phone.",
                "VOICE_PROCESSING_FAILED_WITH_FALLBACK"
            )
        else:
            raise internal_server_error("Failed to process audio and fallback notification", "AUDIO_PROCESSING_AND_FALLBACK_FAILED")

@router.post("/message", response_model=VoiceCallResponse)
async def handle_voice_message(
    request: VoiceCallRequest,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Handle voice message processing and continue conversation with persistent session state.
    """
    try:
        if not request.session_id:
            raise bad_request_error("Session ID is required", "SESSION_ID_REQUIRED")
        
        # Get existing voice session
        session = await get_or_create_voice_session(request.session_id, current_user.id, db)
        
        # If audio_url is provided, transcribe it
        transcription = None
        if request.audio_url:
            transcription = await assemblyai_provider.transcribe_audio(request.audio_url)
        
        # Update context with any provided context from request
        current_context = session.context.copy()
        if request.context:
            current_context.update(request.context)
        
        # Build comprehensive prompt with conversation history
        prompt = await build_conversation_prompt(transcription or "Continue conversation", session)
        
        # Generate AI response with user context
        ai_response = await ai_service.generate_text(
            prompt,
            user_id=current_user.id,
            context={
                "session_id": request.session_id,
                "user_id": current_user.id,
                "username": current_user.username,
                "is_voice": True,
                "current_state": session.current_state,
                "collected_data": current_context
            }
        )
        
        # Update session state based on AI response
        new_state = session.current_state
        new_context = current_context.copy()
        
        # State transition logic
        if "greet" in ai_response.lower() or "hello" in ai_response.lower():
            new_state = "greeting"
        elif "date" in ai_response.lower() or "time" in ai_response.lower():
            new_state = "collecting_details"
            new_context["awaiting_datetime"] = True
        elif "confirm" in ai_response.lower() and "appointment" in ai_response.lower():
            new_state = "confirming"
            new_context["ready_to_confirm"] = True
        elif "booked" in ai_response.lower() or "scheduled" in ai_response.lower():
            new_state = "booked"
        
        # Update session with new conversation and context
        session = await update_voice_session(
            session,
            new_state,
            new_context,
            transcription,
            ai_response,
            db
        )
        
        # Determine next action based on current state
        next_action = "continue_conversation"
        if session.current_state == "confirming":
            next_action = "confirm_booking"
        elif session.current_state == "collecting_details":
            next_action = "get_appointment_details"
        elif session.current_state == "booked":
            next_action = "appointment_booked"
        
        return VoiceCallResponse(
            transcription=transcription,
            response=ai_response,
            session_id=request.session_id,
            next_action=next_action,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Voice message handling error: {str(e)}")
        raise internal_server_error("Failed to process voice message", "VOICE_MESSAGE_PROCESSING_FAILED")

@router.post("/book-appointment")
async def book_appointment(
    date: str = Form(...),
    time: str = Form(...),
    appointment_type: str = Form(...),
    session_id: str = Form(...),
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Book an appointment based on voice conversation details.
    """
    try:
        # Parse date and time
        try:
            appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
            appointment_time = datetime.strptime(time, "%H:%M").time()
        except ValueError:
            raise bad_request_error("Invalid date or time format", "INVALID_DATETIME_FORMAT")
        
        # Create datetime objects for start and end times
        start_time = datetime.combine(appointment_date, appointment_time)
        end_time = start_time + datetime.timedelta(minutes=30)  # 30-minute appointment
        
        # Create calendar event using Google Calendar
        event = await calendar_service.create_appointment(
            summary=f"Appointment: {appointment_type}",
            start_time=start_time,
            end_time=end_time,
            description=f"Appointment booked via voice call for {current_user.username}",
            attendee_emails=[current_user.email] if current_user.email else None
        )
        
        if not event:
            raise internal_server_error("Failed to create calendar event", "CALENDAR_EVENT_CREATION_FAILED")
        
        return JSONResponse(content={
            "status": "success",
            "message": "Appointment booked successfully",
            "appointment": {
                "id": event.get('id'),
                "date": date,
                "time": time,
                "type": appointment_type,
                "session_id": session_id,
                "calendar_link": event.get('htmlLink'),
                "event_id": event.get('id')
            }
        })
        
    except Exception as e:
        logger.error(f"Appointment booking error: {str(e)}")
        raise internal_server_error("Failed to book appointment", "APPOINTMENT_BOOKING_FAILED")

@router.get("/availability")
async def get_availability(
    date: Optional[str] = None,
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Get available time slots for appointment booking.
    """
    try:
        # Use today's date if not provided
        target_date = datetime.now().date()
        if date:
            try:
                target_date = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                raise bad_request_error("Invalid date format. Use YYYY-MM-DD.", "INVALID_DATE_FORMAT")
        
        # Get available time slots from Google Calendar
        available_slots = await calendar_service.get_available_time_slots(target_date)
        
        # Format response
        formatted_slots = [slot['formatted'] for slot in available_slots]
        
        return JSONResponse(content={
            "available_slots": formatted_slots,
            "date": target_date.isoformat()
        })
        
    except Exception as e:
        logger.error(f"Availability check error: {str(e)}")
        raise internal_server_error("Failed to check availability", "AVAILABILITY_CHECK_FAILED")