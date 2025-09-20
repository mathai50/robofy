"""
Router for handling tool calls from voice AI services like ElevenLabs.
This replaces the need for a separate automation tool like n8n.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from typing import Dict, Any
import os
import logging

from seo_agents.agents.appointment_booking_agent import (
    get_availability,
    create_appointment,
    log_booking_details,
)

router = APIRouter(
    prefix="/api/voice-tools",
    tags=["Voice AI Tools"],
)

logger = logging.getLogger(__name__)

# --- Security Dependency ---
async def verify_api_key(x_api_key: str = Header(...)):
    """Verify the API key from the header matches the one in our environment."""
    # This is a simple static API key for system-to-system auth.
    # It's more secure than an open webhook.
    expected_api_key = os.getenv("VOICE_TOOLS_API_KEY")
    if not expected_api_key or x_api_key != expected_api_key:
        logger.warning("Invalid or missing API key for voice tool access.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )

TOOL_MAP = {
    "get_availability": get_availability,
    "create_appointment": create_appointment,
    "log_booking_details": log_booking_details,
    # Aliases for dental_appointment_agent_casey
    "log_patient_details": log_booking_details,
    # Aliases for robofy_onboarding_agent
    "get_demo_availability": get_availability,
    "book_demo": create_appointment,
    "log_lead_details": log_booking_details,
}

@router.post("/{tool_name}", dependencies=[Depends(verify_api_key)])
async def handle_voice_tool_call(tool_name: str, request: Request):
    """
    A single, dynamic endpoint to handle all tool calls from the voice agent.
    The `tool_name` in the URL must match a key in our TOOL_MAP.
    """
    if tool_name not in TOOL_MAP:
        logger.error(f"Attempted to call unknown voice tool: {tool_name}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool '{tool_name}' not found.",
        )

    try:
        payload = await request.json()
        logger.info(f"Received call for tool '{tool_name}' with payload: {payload}")
        
        tool_function = TOOL_MAP[tool_name]
        result = await tool_function(payload)
        return result
    except Exception as e:
        logger.error(f"Error executing tool '{tool_name}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while executing the tool: {str(e)}",
        )