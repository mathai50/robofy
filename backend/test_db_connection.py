#!/usr/bin/env python3
"""
Supabase Database Connection Test Script
This script tests the connection to the Supabase PostgreSQL database.
"""

import os
import sys
import psycopg2
from psycopg2 import OperationalError
from urllib.parse import urlparse

def test_database_connection():
    """Test connection to the Supabase PostgreSQL database."""
    
    # Get database URL from environment variable
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ Error: DATABASE_URL environment variable is not set")
        print("Please set DATABASE_URL in your environment or .env file")
        return False
    
    print(f"🔗 Testing connection to: {database_url}")
    
    try:
        # Parse the database URL
        result = urlparse(database_url)
        
        # Extract connection parameters
        dbname = result.path[1:]  # Remove leading slash
        user = result.username
        password = result.password
        host = result.hostname
        port = result.port
        
        print(f"📊 Connection details:")
        print(f"   Host: {host}")
        print(f"   Port: {port}")
        print(f"   Database: {dbname}")
        print(f"   User: {user}")
        
        # Establish connection
        print("🔄 Attempting to connect to database...")
        connection = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
            connect_timeout=10
        )
        
        # Test basic operations
        cursor = connection.cursor()
        
        # Check database version
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        print(f"✅ Connected successfully!")
        print(f"📋 PostgreSQL Version: {db_version[0]}")
        
        # Check if we can query some basic information
        cursor.execute("SELECT current_database(), current_user, current_timestamp;")
        db_info = cursor.fetchone()
        print(f"📊 Current Database: {db_info[0]}")
        print(f"👤 Current User: {db_info[1]}")
        print(f"⏰ Server Time: {db_info[2]}")
        
        # List available tables (if any)
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        
        if tables:
            print("📋 Available tables:")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("ℹ️  No tables found in public schema")
        
        # Clean up
        cursor.close()
        connection.close()
        
        print("🎉 Database connection test completed successfully!")
        return True
        
    except OperationalError as e:
        print(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Supabase Database Connection Test")
    print("=" * 50)
    
    success = test_database_connection()
    
    if success:
        print("\n✅ Test completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Test failed!")
        sys.exit(1)