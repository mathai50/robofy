#!/usr/bin/env python3
"""
Test script to verify async database operations work correctly.
This tests the new get_async_db() function implementation.
"""
import asyncio
import sys
import os

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import get_async_db, APIKey as APIKeyModel
from sqlalchemy import select

async def test_async_db_connection():
    """Test that async database connection and query work correctly."""
    print("Testing async database connection...")
    
    try:
        # Test the async generator pattern
        async for db in get_async_db():
            # Perform a simple async query to verify connection works
            result = await db.execute(select(APIKeyModel).limit(1))
            api_key = result.scalar_one_or_none()
            
            if api_key:
                print(f"✅ Successfully retrieved API key record: ID {api_key.id}")
            else:
                print("✅ Successfully connected to database (no API keys found yet)")
            
            # Test that we can commit and close properly
            await db.commit()
            print("✅ Async session commit successful")
            
        print("✅ Async database operations completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error during async database test: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Main async test function."""
    print("Starting async database tests...")
    success = await test_async_db_connection()
    
    if success:
        print("\n🎉 All async database tests passed!")
        return 0
    else:
        print("\n💥 Async database tests failed!")
        return 1

if __name__ == "__main__":
    # Run the async tests
    exit_code = asyncio.run(main())
    sys.exit(exit_code)