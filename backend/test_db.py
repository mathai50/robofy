#!/usr/bin/env python3
"""
Test script to verify PostgreSQL database connection and table creation.
Run this script to test if the database setup is working correctly.
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from database import Base, engine

# Load environment variables
load_dotenv()

def test_connection():
    """Test database connection"""
    try:
        # Get database URL from environment
        database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/robofy")
        print(f"Testing connection to: {database_url}")
        
        # Create engine and test connection
        test_engine = create_engine(database_url)
        with test_engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.scalar()
            print(f"✅ PostgreSQL version: {version}")
            return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def create_tables_test():
    """Test table creation"""
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully")
        return True
    except Exception as e:
        print(f"❌ Table creation failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing PostgreSQL database connection for Robofy...")
    print("=" * 50)
    
    # Test connection
    if test_connection():
        # Create tables
        create_tables_test()
    else:
        print("Please ensure PostgreSQL is running and the DATABASE_URL is correct in .env file")
        print("Default DATABASE_URL: postgresql://user:password@localhost:5432/robofy")
        sys.exit(1)