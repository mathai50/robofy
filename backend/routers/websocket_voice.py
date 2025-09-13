"""
WebSocket router for real-time voice streaming and transcription.
Handles live audio streaming, real-time transcription, and interactive voice conversations.
"""
import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Any, List, Optional
from datetime import datetime

from providers.assemblyai_provider import AssemblyAIProvider
from providers.twilio_provider import TwilioProvider
from ai_service import ai_service
from database import get_async_db, User as UserModel
from auth import get_current_user_ws

router = APIRouter()
logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manage WebSocket connections for real-time voice streaming."""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.session_data: Dict[str, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket, session_id: str):
        """Accept WebSocket connection and store session."""
        await websocket.accept()
        self.active_connections[session_id] = websocket
        self.session_data[session_id] = {
            "connected_at": datetime.now(),
            "audio_buffer": [],
            "transcription": "",
            "conversation_context": {}
        }
        logger.info(f"WebSocket connected for session: {session_id}")
    
    def disconnect(self, session_id: str):
        """Remove WebSocket connection."""
        if session_id in self.active_connections:
            del self.active_connections[session_id]
        if session_id in self.session_data:
            del self.session_data[session_id]
        logger.info(f"WebSocket disconnected for session: {session_id}")
    
    async def send_message(self, session_id: str, message: Dict[str, Any]):
        """Send message to specific WebSocket client."""
        if session_id in self.active_connections:
            try:
                await self.active_connections[session_id].send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to {session_id}: {str(e)}")
                self.disconnect(session_id)
    
    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients."""
        for session_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to {session_id}: {str(e)}")
                self.disconnect(session_id)

# Global connection manager
manager = ConnectionManager()
assemblyai_provider = AssemblyAIProvider()
twilio_provider = TwilioProvider()

async def send_websocket_fallback_notification(user_id: int, message: str, session_id: str) -> Optional[Dict[str, Any]]:
    """Send fallback notification via SMS/WhatsApp if WebSocket voice communication fails."""
    try:
        # Get async database session
        async for db in get_async_db():
            # Get user's phone number from database
            user = await db.get(UserModel, user_id)
            if not user or not user.phone_number:
                logger.warning(f"Cannot send fallback message: no phone number for user {user_id}")
                return None
            
            # Use Twilio provider to send fallback message
            fallback_message = f"{message} (Session: {session_id})"
            return await twilio_provider.send_fallback_message(user.phone_number, fallback_message)
            
    except Exception as e:
        logger.error(f"WebSocket fallback notification failed for user {user_id}: {str(e)}")
        return None

@router.websocket("/ws/voice/stream")
async def websocket_voice_stream(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time voice streaming and transcription.
    Handles audio chunks, transcribes in real-time, and manages conversation flow.
    """
    # Get token from query parameters for authentication
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008, reason="Authentication token required")
        return

    # Authenticate user via token
    try:
        async for db in get_async_db():
            user = await get_current_user_ws(token, db)
            user_id = user.id
            break
    except Exception as e:
        logger.error(f"WebSocket authentication failed: {str(e)}")
        await websocket.close(code=1008, reason="Authentication failed")
        return
    
    await manager.connect(websocket, session_id)
    
    # Store user ID in session data for fallback notifications
    manager.session_data[session_id]["user_id"] = user_id
    
    try:
        # Initialize real-time transcription session
        transcription_session = await assemblyai_provider.start_realtime_session()
        
        async def handle_audio_chunk(audio_chunk: bytes):
            """Process audio chunk and get real-time transcription."""
            try:
                # Send audio to AssemblyAI for real-time transcription
                transcription_result = await transcription_session.process_audio(audio_chunk)
                
                if transcription_result and transcription_result.text:
                    # Update session transcription
                    manager.session_data[session_id]["transcription"] += transcription_result.text + " "
                    
                    # Send transcription to client
                    await manager.send_message(session_id, {
                        "type": "transcription",
                        "text": transcription_result.text,
                        "is_final": transcription_result.is_final,
                        "timestamp": datetime.now().isoformat()
                    })
                    
                    # If transcription is final, process with AI
                    if transcription_result.is_final:
                        await process_transcription_with_ai(session_id, transcription_result.text)
                        
            except Exception as e:
                logger.error(f"Error processing audio chunk: {str(e)}")
                await manager.send_message(session_id, {
                    "type": "error",
                    "message": f"Audio processing error: {str(e)}"
                })
                
                # Send fallback notification if audio processing fails repeatedly
                user_id = manager.session_data[session_id].get("user_id")
                if user_id:
                    fallback_message = "We're having trouble with voice processing. Please try again or use text chat."
                    await send_websocket_fallback_notification(user_id, fallback_message, session_id)
        
        async def process_transcription_with_ai(session_id: str, text: str):
            """Process completed transcription with AI for conversation."""
            try:
                # Get conversation context
                context = manager.session_data[session_id].get("conversation_context", {})
                
                # Generate AI response
                ai_response = await ai_service.generate_text(
                    f"User said: {text}\n\nContinue the appointment booking conversation:",
                    context=context
                )
                
                # Update conversation context
                manager.session_data[session_id]["conversation_context"] = {
                    **context,
                    "last_user_input": text,
                    "last_ai_response": ai_response
                }
                
                # Send AI response to client
                await manager.send_message(session_id, {
                    "type": "ai_response",
                    "text": ai_response,
                    "timestamp": datetime.now().isoformat()
                })
                
            except Exception as e:
                logger.error(f"AI processing error: {str(e)}")
                await manager.send_message(session_id, {
                    "type": "error",
                    "message": f"AI processing error: {str(e)}"
                })
        
        # Main message handling loop
        while True:
            try:
                data = await websocket.receive()
                
                if data.get("type") == "websocket.receive":
                    message = data.get("text")
                    if message:
                        message_data = json.loads(message)
                        
                        if message_data.get("type") == "audio_chunk":
                            # Handle audio data (base64 encoded)
                            audio_chunk = message_data.get("data")
                            if audio_chunk:
                                # Decode base64 audio chunk
                                import base64
                                audio_bytes = base64.b64decode(audio_chunk)
                                await handle_audio_chunk(audio_bytes)
                        
                        elif message_data.get("type") == "text_message":
                            # Handle text messages (fallback)
                            text = message_data.get("text")
                            if text:
                                await process_transcription_with_ai(session_id, text)
                        
                        elif message_data.get("type") == "command":
                            # Handle commands (e.g., start, stop, reset)
                            command = message_data.get("command")
                            if command == "start_recording":
                                await manager.send_message(session_id, {
                                    "type": "status",
                                    "message": "Recording started"
                                })
                            elif command == "stop_recording":
                                await manager.send_message(session_id, {
                                    "type": "status",
                                    "message": "Recording stopped"
                                })
                            elif command == "reset_conversation":
                                manager.session_data[session_id]["conversation_context"] = {}
                                await manager.send_message(session_id, {
                                    "type": "status",
                                    "message": "Conversation reset"
                                })
                
            except WebSocketDisconnect:
                logger.info(f"WebSocket disconnected for session: {session_id}")
                break
            except Exception as e:
                logger.error(f"WebSocket error: {str(e)}")
                await manager.send_message(session_id, {
                    "type": "error",
                    "message": f"Connection error: {str(e)}"
                })
                break
    
    except Exception as e:
        logger.error(f"WebSocket connection error: {str(e)}")
    finally:
        manager.disconnect(session_id)
        # Clean up transcription session
        if 'transcription_session' in locals():
            await transcription_session.close()

@router.websocket("/ws/voice/status")
async def websocket_voice_status(websocket: WebSocket):
    """
    WebSocket endpoint for voice system status and monitoring.
    Provides real-time updates on system health and connection status.
    """
    await websocket.accept()
    
    try:
        while True:
            # Send system status updates
            status = {
                "type": "system_status",
                "timestamp": datetime.now().isoformat(),
                "active_connections": len(manager.active_connections),
                "assemblyai_available": assemblyai_provider.is_available(),
                "ai_services_available": await ai_service.get_provider_status()
            }
            
            await websocket.send_json(status)
            await asyncio.sleep(10)  # Send status every 10 seconds
            
    except WebSocketDisconnect:
        logger.info("Status WebSocket disconnected")
    except Exception as e:
        logger.error(f"Status WebSocket error: {str(e)}")