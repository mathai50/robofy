"""
Test script to verify AI service functionality without database dependencies.
"""
import asyncio
import os
import sys
import pathlib

# Add the current directory to Python path to handle imports
current_dir = pathlib.Path(__file__).parent
sys.path.insert(0, str(current_dir))

from ai_service import AIServiceManager

async def test_ai_service():
    """Test the AI service with a simple prompt."""
    # Set up environment variables for testing
    os.environ['DEEPSEEK_API_KEY'] = 'test_key'  # Mock key for testing availability
    os.environ['GOOGLE_API_KEY'] = 'test_key'
    os.environ['OPENAI_API_KEY'] = 'test_key'
    os.environ['HUGGINGFACE_API_KEY'] = 'test_key'
    
    # Initialize AI service
    ai_service = AIServiceManager()
    
    # Test provider status
    status = await ai_service.get_provider_status()
    print("Provider Status:", status)
    
    # Test with a simple prompt (should fail due to mock keys, but should show the structure works)
    try:
        prompt = "Hello, how are you?"
        result = await ai_service.generate_text(prompt)
        print("AI Response:", result)
    except Exception as e:
        print("AI Service Error (expected due to mock keys):", str(e))
    
    await ai_service.close()

if __name__ == "__main__":
    asyncio.run(test_ai_service())