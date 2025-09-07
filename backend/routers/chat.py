"""
Chat API router for AI-powered chat interface.
Provides endpoints compatible with Vercel AI SDK.
"""
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import uuid
import json
import asyncio
from datetime import datetime
import logging

from backend.database import get_db, ChatSession, ChatMessage

logger = logging.getLogger(__name__)
from backend.ai_service import ai_service
from backend.config import settings
from backend.mcp_client import get_seo_client
from backend.google_calendar import get_google_calendar_client

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatMessageRequest:
    """Request model for sending a chat message."""
    def __init__(self, message: str, session_id: Optional[str] = None):
        self.message = message
        self.session_id = session_id

def detect_intent(user_message: str) -> Dict[str, Any]:
    """Detect user intent from the message content."""
    user_message_lower = user_message.lower()
    
    # Intent patterns
    intent_patterns = {
        "seo_analysis": [
            "seo", "search engine", "ranking", "keyword", "organic traffic",
            "google ranking", "search optimization"
        ],
        "social_post": [
            "social media", "post on", "tweet", "facebook", "instagram", "linkedin",
            "create post", "share on", "social content"
        ],
        "appointment": [
            "schedule", "appointment", "meeting", "book a call", "calendar",
            "set up a meeting", "availability", "google calendar"
        ],
        "competition_analysis": [
            "competitor", "competition", "compare to", "vs ", "versus",
            "market analysis", "competitive analysis"
        ],
        "faq": [
            "how to", "what is", "how do i", "can you explain", "tell me about",
            "what are", "help with", "question about"
        ],
        "customer_support": [
            "help", "support", "problem", "issue", "not working",
            "error", "bug", "assistance"
        ]
    }
    
    # Default intent is general conversation
    detected_intent = "general"
    confidence = 0.0
    parameters = {}
    
    # Check for intent matches
    for intent, patterns in intent_patterns.items():
        for pattern in patterns:
            if pattern in user_message_lower:
                detected_intent = intent
                confidence = 0.8  # Basic confidence score
                break
    
    # Extract parameters for specific intents
    if detected_intent == "appointment":
        # Simple date/time extraction (can be enhanced with proper NLP)
        time_patterns = [
            "at [0-9]{1,2}(:[0-9]{2})? (am|pm)",
            "on [A-Za-z]+day",
            "next week",
            "tomorrow",
            "today"
        ]
        # This is a placeholder - in production, use a proper date parser
        parameters["time_mentioned"] = any(pattern in user_message_lower for pattern in time_patterns)
    
    elif detected_intent == "seo_analysis":
        # Extract potential domain or topic
        if "website" in user_message_lower or "domain" in user_message_lower:
            parameters["analysis_type"] = "website"
        elif "keyword" in user_message_lower:
            parameters["analysis_type"] = "keyword"
    
    elif detected_intent == "social_post":
        # Extract platform if mentioned
        platforms = ["facebook", "instagram", "twitter", "x", "linkedin", "tiktok"]
        for platform in platforms:
            if platform in user_message_lower:
                parameters["platform"] = platform
                break
        # Extract content type or topic if possible
        if "post" in user_message_lower or "content" in user_message_lower:
            parameters["content_type"] = "post"
        elif "story" in user_message_lower:
            parameters["content_type"] = "story"
        elif "reel" in user_message_lower:
            parameters["content_type"] = "reel"
    
    return {
        "intent": detected_intent,
        "confidence": confidence,
        "parameters": parameters
    }

async def handle_seo_analysis(user_message: str) -> str:
    """Handle SEO analysis requests using MCP client."""
    try:
        # Extract domain or topic from user message (simple extraction)
        # This could be enhanced with proper NLP in the future
        if "website" in user_message.lower() or "domain" in user_message.lower():
            # Look for domain patterns
            domain_pattern = r'(https?://)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})'
            import re
            match = re.search(domain_pattern, user_message)
            if match:
                domain = match.group(0)
                async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
                    analysis = await seo_client.seo_audit(domain)
                    return f"SEO Analysis for {domain}:\n\n{analysis}"
        
        # Default to general SEO analysis
        async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
            analysis = await seo_client.conduct_keyword_research(user_message)
            return f"SEO Analysis:\n\n{analysis}"
            
    except Exception as e:
        logger.error(f"SEO analysis error: {str(e)}")
        return f"I encountered an error while performing SEO analysis. Please try again later or contact support."

async def handle_social_post(user_message: str) -> str:
    """Handle social media post creation requests."""
    try:
        # Extract parameters from intent detection
        intent_info = detect_intent(user_message)
        parameters = intent_info.get("parameters", {})
        platform = parameters.get("platform", "general")
        content_type = parameters.get("content_type", "post")
        
        # Create a prompt for AI to generate social post
        prompt = f"""
        Create a engaging social media post for {platform} as a {content_type}.
        The user's request is: {user_message}
        
        Please generate a complete post with appropriate tone, hashtags, and emojis if suitable.
        Keep it concise and engaging.
        """
        
        # Use AI service to generate the post
        response = await ai_service.generate_text(prompt, max_tokens=300)
        return response
        
    except Exception as e:
        logger.error(f"Social post creation error: {str(e)}")
        return f"I encountered an error while creating the social post. Please try again later."

async def handle_appointment(user_message: str) -> str:
    """Handle appointment booking requests using Google Calendar."""
    try:
        # For now, return a message about appointment booking capabilities
        # In a real implementation, this would integrate with Google Calendar API
        # to create events and check availability
        
        return """I can help you schedule appointments using Google Calendar!

To book an appointment, please provide:
- Your preferred date and time
- The purpose of the meeting
- Your email address for calendar invites

For example: "I'd like to schedule a consultation for next Tuesday at 2 PM"

Note: Google Calendar integration requires proper setup with service account credentials."""
        
    except Exception as e:
        logger.error(f"Appointment handling error: {str(e)}")
        return f"I encountered an error while handling the appointment request. Please try again later."

async def handle_faq(user_message: str) -> str:
    """Handle FAQ requests with AI-generated responses."""
    try:
        # Use AI service to generate FAQ responses
        prompt = f"""
        You are a customer support specialist for Robofy AI, a digital marketing automation platform.
        Provide clear, helpful answers to common questions about digital marketing automation and AI solutions.
        
        User's question: {user_message}
        
        Please provide a concise, informative response that addresses the user's query directly.
        If the question is not related to our services, politely redirect to relevant topics.
        """
        
        response = await ai_service.generate_text(prompt, max_tokens=300)
        return response
        
    except Exception as e:
        logger.error(f"FAQ handling error: {str(e)}")
        return f"I encountered an error while processing your question. Please try again later."

async def handle_customer_support(user_message: str) -> str:
    """Handle customer support requests with AI-generated responses."""
    try:
        # Use AI service to generate support responses
        prompt = f"""
        You are a technical support agent for Robofy AI. Help users resolve issues with our platform
        and provide troubleshooting guidance. Be empathetic and solution-oriented.
        
        User's issue: {user_message}
        
        Please provide step-by-step troubleshooting advice or direct the user to appropriate resources.
        If the issue requires human intervention, explain the next steps for support escalation.
        """
        
        response = await ai_service.generate_text(prompt, max_tokens=400)
        return response
        
    except Exception as e:
        logger.error(f"Customer support error: {str(e)}")
        return f"I encountered an error while processing your support request. Please try again later."

async def log_analytics(session_id: int, user_message: str, assistant_response: str, intent_info: Dict[str, Any]):
    """Log analytics data for chat interactions."""
    try:
        # Log basic analytics - in production, save to a dedicated analytics table
        logger.info(
            f"Analytics: Session {session_id}, "
            f"Intent: {intent_info['intent']}, "
            f"Confidence: {intent_info['confidence']:.2f}, "
            f"User Message Length: {len(user_message)}, "
            f"Response Length: {len(assistant_response)}"
        )
        # Additional metrics can be added here, such as response time, engagement, etc.
    except Exception as e:
        logger.error(f"Analytics logging error: {str(e)}")

async def generate_ai_response(session_id: int, user_message: str, db: Session):
    """Generate AI response using the AI service manager with intent recognition."""
    try:
        # Detect user intent
        intent_info = detect_intent(user_message)
        detected_intent = intent_info["intent"]
        
        # Handle specific intents with dedicated functions
        if detected_intent == "seo_analysis" and settings.MCP_SEO_ANALYSIS_URL:
            # Use MCP client for SEO analysis
            response = await handle_seo_analysis(user_message)
        elif detected_intent == "social_post":
            # Handle social media post creation
            response = await handle_social_post(user_message)
        elif detected_intent == "appointment":
            # Handle appointment booking
            response = await handle_appointment(user_message)
        elif detected_intent == "faq":
            # Handle FAQ requests
            response = await handle_faq(user_message)
        elif detected_intent == "customer_support":
            # Handle customer support requests
            response = await handle_customer_support(user_message)
        else:
            # Create system prompt based on detected intent
            system_prompts = {
                "general": """You are Robofy AI, a helpful assistant for digital marketing automation.
                Be friendly, professional, and focused on providing value.""",
                
                "seo_analysis": """You are an SEO expert assistant. Provide detailed SEO analysis and recommendations.
                Focus on keyword research, on-page optimization, technical SEO, and content strategy.""",
                
                "social_post": """You are a social media content creator. Generate engaging social media posts
                tailored for different platforms (Facebook, Instagram, Twitter, LinkedIn). Include relevant hashtags
                and emojis when appropriate.""",
                
                "appointment": """You are a scheduling assistant. Help users book appointments and meetings.
                Provide available time slots and gather necessary information for scheduling.""",
                
                "competition_analysis": """You are a competitive analysis expert. Provide insights into competitors'
                strategies, market positioning, and opportunities for differentiation.""",
                
                "faq": """You are a customer support specialist. Provide clear, helpful answers to common questions
                about digital marketing automation and AI solutions.""",
                
                "customer_support": """You are a technical support agent. Help users resolve issues with our platform
                and provide troubleshooting guidance."""
            }
            
            system_prompt = system_prompts.get(detected_intent, system_prompts["general"])
            
            # Add intent context to the prompt
            intent_context = f"\n\nUser intent detected: {detected_intent} (confidence: {intent_info['confidence']})"
            if intent_info['parameters']:
                intent_context += f"\nParameters: {intent_info['parameters']}"
            
            full_prompt = f"{system_prompt}{intent_context}\n\nUser: {user_message}\nAssistant:"

            # Generate response using AI service
            response = await ai_service.generate_text(full_prompt, max_tokens=500)
        
        # Save assistant message to database with intent metadata
        assistant_message = ChatMessage(
            session_id=session_id,
            message_id=str(uuid.uuid4()),
            role="assistant",
            content=response,
            timestamp=datetime.utcnow(),
            metadata={
                "intent": detected_intent,
                "confidence": intent_info["confidence"],
                "parameters": intent_info["parameters"]
            }
        )
        db.add(assistant_message)
        db.commit()
        
        # Log analytics for the interaction
        await log_analytics(session_id, user_message, response, intent_info)
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/sessions")
async def create_chat_session(db: Session = Depends(get_db)):
    """Create a new chat session."""
    try:
        session_id = str(uuid.uuid4())
        chat_session = ChatSession(
            session_id=session_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            status="active"
        )
        db.add(chat_session)
        db.commit()
        db.refresh(chat_session)
        
        return {"session_id": session_id, "session": chat_session.to_dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@router.get("/sessions/{session_id}")
async def get_chat_session(session_id: str, db: Session = Depends(get_db)):
    """Get chat session details and message history."""
    try:
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        if not chat_session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        messages = db.query(ChatMessage).filter(ChatMessage.session_id == chat_session.id).order_by(ChatMessage.timestamp).all()
        
        return {
            "session": chat_session.to_dict(),
            "messages": [msg.to_dict() for msg in messages]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get session: {str(e)}")

@router.post("/messages")
async def send_chat_message(
    request: Dict[str, Any],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Send a chat message and stream AI response (Vercel AI SDK compatible)."""
    try:
        message = request.get("message")
        session_id = request.get("session_id")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get or create session
        if session_id:
            chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
            if not chat_session:
                raise HTTPException(status_code=404, detail="Session not found")
        else:
            # Create new session if no session_id provided
            session_id = str(uuid.uuid4())
            chat_session = ChatSession(
                session_id=session_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                status="active"
            )
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)
        
        # Save user message to database
        user_message = ChatMessage(
            session_id=chat_session.id,
            message_id=str(uuid.uuid4()),
            role="user",
            content=message,
            timestamp=datetime.utcnow()
        )
        db.add(user_message)
        db.commit()
        
        # Update session timestamp
        chat_session.updated_at = datetime.utcnow()
        db.commit()
        
        # Detect user intent
        intent_info = detect_intent(message)
        detected_intent = intent_info["intent"]
        
        full_response = ""  # for AI streaming
        
        # If SEO analysis and MCP client available, handle it and save response
        if detected_intent == "seo_analysis" and settings.MCP_SEO_ANALYSIS_URL:
            seo_response = await handle_seo_analysis(message)
            # Save assistant message immediately
            assistant_message = ChatMessage(
                session_id=chat_session.id,
                message_id=str(uuid.uuid4()),
                role="assistant",
                content=seo_response,
                timestamp=datetime.utcnow(),
                metadata={
                    "intent": detected_intent,
                    "confidence": intent_info["confidence"],
                    "parameters": intent_info["parameters"]
                }
            )
            db.add(assistant_message)
            db.commit()
            full_response = seo_response
        elif detected_intent == "social_post":
            # Handle social post creation and save response immediately
            social_response = await handle_social_post(message)
            assistant_message = ChatMessage(
                session_id=chat_session.id,
                message_id=str(uuid.uuid4()),
                role="assistant",
                content=social_response,
                timestamp=datetime.utcnow(),
                metadata={
                    "intent": detected_intent,
                    "confidence": intent_info["confidence"],
                    "parameters": intent_info["parameters"]
                }
            )
            db.add(assistant_message)
            db.commit()
            full_response = social_response
        elif detected_intent == "appointment":
            # Handle appointment booking and save response immediately
            appointment_response = await handle_appointment(message)
            assistant_message = ChatMessage(
                session_id=chat_session.id,
                message_id=str(uuid.uuid4()),
                role="assistant",
                content=appointment_response,
                timestamp=datetime.utcnow(),
                metadata={
                    "intent": detected_intent,
                    "confidence": intent_info["confidence"],
                    "parameters": intent_info["parameters"]
                }
            )
            db.add(assistant_message)
            db.commit()
            full_response = appointment_response
        
        async def response_stream():
            try:
                if detected_intent == "seo_analysis" and settings.MCP_SEO_ANALYSIS_URL:
                    # Stream the SEO response in chunks
                    chunks = [full_response[i:i+100] for i in range(0, len(full_response), 100)]
                    for chunk in chunks:
                        yield f"data: {json.dumps({'text': chunk})}\n\n"
                elif detected_intent == "social_post":
                    # Stream the social post response in chunks
                    chunks = [full_response[i:i+100] for i in range(0, len(full_response), 100)]
                    for chunk in chunks:
                        yield f"data: {json.dumps({'text': chunk})}\n\n"
                elif detected_intent == "appointment":
                    # Stream the appointment response in chunks
                    chunks = [full_response[i:i+100] for i in range(0, len(full_response), 100)]
                    for chunk in chunks:
                        yield f"data: {json.dumps({'text': chunk})}\n\n"
                elif detected_intent == "faq":
                    # Stream the FAQ response in chunks
                    chunks = [full_response[i:i+100] for i in range(0, len(full_response), 100)]
                    for chunk in chunks:
                        yield f"data: {json.dumps({'text': chunk})}\n\n"
                elif detected_intent == "customer_support":
                    # Stream the customer support response in chunks
                    chunks = [full_response[i:i+100] for i in range(0, len(full_response), 100)]
                    for chunk in chunks:
                        yield f"data: {json.dumps({'text': chunk})}\n\n"
                else:
                    # Build prompt with intent context
                    system_prompts = {
                        "general": """You are Robofy AI, a helpful assistant for digital marketing automation.
                        Be friendly, professional, and focused on providing value.""",
                        "seo_analysis": """You are an SEO expert assistant. Provide detailed SEO analysis and recommendations.
                        Focus on keyword research, on-page optimization, technical SEO, and content strategy.""",
                        "social_post": """You are a social media content creator. Generate engaging social media posts
                        tailored for different platforms (Facebook, Instagram, Twitter, LinkedIn). Include relevant hashtags
                        and emojis when appropriate.""",
                        "appointment": """You are a scheduling assistant. Help users book appointments and meetings.
                        Provide available time slots and gather necessary information for scheduling.""",
                        "competition_analysis": """You are a competitive analysis expert. Provide insights into competitors'
                        strategies, market positioning, and opportunities for differentiation.""",
                        "faq": """You are a customer support specialist. Provide clear, helpful answers to common questions
                        about digital marketing automation and AI solutions.""",
                        "customer_support": """You are a technical support agent. Help users resolve issues with our platform
                        and provide troubleshooting guidance."""
                    }
                    system_prompt = system_prompts.get(detected_intent, system_prompts["general"])
                    
                    intent_context = f"\n\nUser intent detected: {detected_intent} (confidence: {intent_info['confidence']})"
                    if intent_info['parameters']:
                        intent_context += f"\nParameters: {intent_info['parameters']}"
                    
                    full_prompt = f"{system_prompt}{intent_context}\n\nUser: {message}\nAssistant:"
                    
                    # Generate response using AI service streaming
                    async for chunk in ai_service.generate_text_stream(full_prompt, max_tokens=500):
                        yield f"data: {json.dumps({'text': chunk})}\n\n"
                        full_response += chunk
                
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                error_msg = f"Error generating response: {str(e)}"
                yield f"data: {json.dumps({'error': error_msg})}\n\n"
                yield "data: [DONE]\n\n"
                if detected_intent != "seo_analysis" or not settings.MCP_SEO_ANALYSIS_URL:
                    full_response = error_msg
        
        # Add background task to save assistant message for non-SEO cases
        if detected_intent != "seo_analysis" or not settings.MCP_SEO_ANALYSIS_URL:
            async def save_assistant_message():
                assistant_message = ChatMessage(
                    session_id=chat_session.id,
                    message_id=str(uuid.uuid4()),
                    role="assistant",
                    content=full_response,
                    timestamp=datetime.utcnow(),
                    metadata={
                        "intent": detected_intent,
                        "confidence": intent_info["confidence"],
                        "parameters": intent_info["parameters"]
                    }
                )
                db.add(assistant_message)
                db.commit()
            
            background_tasks.add_task(save_assistant_message)
        
        return StreamingResponse(
            response_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

@router.delete("/sessions/{session_id}")
async def end_chat_session(session_id: str, db: Session = Depends(get_db)):
    """End a chat session."""
    try:
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        if not chat_session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        chat_session.status = "ended"
        chat_session.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Session ended successfully", "session": chat_session.to_dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to end session: {str(e)}")