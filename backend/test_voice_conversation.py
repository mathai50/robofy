"""
Test script for multi-turn voice conversation handling.
This script simulates a conversation flow to test session persistence and state management.
"""
import asyncio
import json
from datetime import datetime
from sqlalchemy.orm import Session

from database import get_db, VoiceSession, create_tables
from routers.voice_call import get_or_create_voice_session, update_voice_session, build_conversation_prompt

async def test_session_creation():
    """Test creating a new voice session."""
    print("=== Testing Session Creation ===")
    
    # Get database session
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        # Create a test session
        session_id = f"test_session_{datetime.now().timestamp()}"
        user_id = 1  # Assuming test user ID
        
        session = await get_or_create_voice_session(session_id, user_id, db)
        
        print(f"Created session: {session.session_id}")
        print(f"Initial state: {session.current_state}")
        print(f"Initial context: {session.context}")
        print(f"Conversation history: {len(session.conversation_history)} messages")
        
        assert session.session_id == session_id
        assert session.current_state == "init"
        assert session.context == {}
        assert session.conversation_history == []
        assert session.is_active == True
        
        print("✅ Session creation test passed!\n")
        
    finally:
        db.close()

async def test_session_update():
    """Test updating a voice session with conversation history."""
    print("=== Testing Session Update ===")
    
    # Get database session
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        # Create a test session
        session_id = f"test_session_update_{datetime.now().timestamp()}"
        user_id = 1
        
        session = await get_or_create_voice_session(session_id, user_id, db)
        
        # Update session with user message and AI response
        user_message = "I'd like to book an appointment"
        ai_response = "Sure! What type of appointment would you like to book?"
        new_state = "collecting_details"
        new_context = {"awaiting_appointment_type": True}
        
        updated_session = await update_voice_session(
            session, new_state, new_context, user_message, ai_response, db
        )
        
        print(f"Updated session state: {updated_session.current_state}")
        print(f"Updated context: {updated_session.context}")
        print(f"Conversation history: {len(updated_session.conversation_history)} messages")
        
        # Check conversation history
        assert len(updated_session.conversation_history) == 2
        assert updated_session.conversation_history[0]["role"] == "user"
        assert updated_session.conversation_history[0]["message"] == user_message
        assert updated_session.conversation_history[1]["role"] == "assistant"
        assert updated_session.conversation_history[1]["message"] == ai_response
        
        # Check state and context
        assert updated_session.current_state == new_state
        assert updated_session.context == new_context
        
        print("✅ Session update test passed!\n")
        
    finally:
        db.close()

async def test_conversation_prompt():
    """Test building conversation prompt with history."""
    print("=== Testing Conversation Prompt Generation ===")
    
    # Get database session
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        # Create a test session with some history
        session_id = f"test_prompt_{datetime.now().timestamp()}"
        user_id = 1
        
        session = await get_or_create_voice_session(session_id, user_id, db)
        
        # Add some conversation history
        session.conversation_history = [
            {"role": "user", "message": "Hello", "timestamp": datetime.now().isoformat()},
            {"role": "assistant", "message": "Hi! How can I help you?", "timestamp": datetime.now().isoformat()},
            {"role": "user", "message": "I need an appointment", "timestamp": datetime.now().isoformat()},
            {"role": "assistant", "message": "What type of appointment?", "timestamp": datetime.now().isoformat()}
        ]
        session.current_state = "collecting_details"
        session.context = {"awaiting_appointment_type": True}
        db.commit()
        
        # Test prompt building
        transcription = "Dental checkup"
        prompt = await build_conversation_prompt(transcription, session)
        
        print("Generated prompt preview:")
        print(prompt[:200] + "..." if len(prompt) > 200 else prompt)
        print("\n")
        
        # Verify prompt contains expected elements
        assert "Current conversation state: collecting_details" in prompt
        assert "Collected information so far:" in prompt
        assert "Conversation history:" in prompt
        assert "Dental checkup" in prompt
        
        print("✅ Conversation prompt test passed!\n")
        
    finally:
        db.close()

async def test_multi_turn_conversation():
    """Test a complete multi-turn conversation flow."""
    print("=== Testing Multi-Turn Conversation Flow ===")
    
    # Get database session
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        session_id = f"multi_turn_test_{datetime.now().timestamp()}"
        user_id = 1
        
        # Simulate conversation turns
        conversation_turns = [
            {"user": "Hello, I want to book an appointment", "expected_state": "greeting"},
            {"user": "Dental cleaning", "expected_state": "collecting_details"},
            {"user": "Tomorrow at 2 PM", "expected_state": "collecting_details"},
            {"user": "Yes, please confirm", "expected_state": "confirming"}
        ]
        
        session = await get_or_create_voice_session(session_id, user_id, db)
        
        for i, turn in enumerate(conversation_turns):
            print(f"Turn {i + 1}: {turn['user']}")
            
            # Build prompt and simulate AI response (in real scenario, this would call AI service)
            prompt = await build_conversation_prompt(turn["user"], session)
            
            # Simulate AI response based on conversation state
            if session.current_state == "init":
                ai_response = "Hello! I'd be happy to help you book an appointment. What type of appointment do you need?"
                new_state = "greeting"
            elif session.current_state == "greeting":
                ai_response = "Great! When would you like to schedule your dental cleaning?"
                new_state = "collecting_details"
                session.context["appointment_type"] = "dental cleaning"
            elif session.current_state == "collecting_details":
                if "appointment_type" not in session.context:
                    ai_response = "What type of appointment would you like?"
                    new_state = "collecting_details"
                else:
                    ai_response = "Thank you! I'll check availability for tomorrow at 2 PM. Should I proceed with booking?"
                    new_state = "confirming"
                    session.context["proposed_datetime"] = "tomorrow at 2 PM"
            else:
                ai_response = "Your appointment has been confirmed! You'll receive a confirmation email shortly."
                new_state = "booked"
            
            # Update session
            session = await update_voice_session(
                session, new_state, session.context, turn["user"], ai_response, db
            )
            
            print(f"  AI: {ai_response}")
            print(f"  State: {session.current_state}")
            print(f"  Context: {session.context}")
            print()
            
            # Verify state transition
            assert session.current_state == turn["expected_state"]
        
        print("✅ Multi-turn conversation test passed!\n")
        
    finally:
        db.close()

async def main():
    """Run all tests."""
    print("Running Voice Conversation Tests...\n")
    
    # Ensure tables are created
    create_tables()
    
    await test_session_creation()
    await test_session_update()
    await test_conversation_prompt()
    await test_multi_turn_conversation()
    
    print("🎉 All tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())