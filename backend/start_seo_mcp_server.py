#!/usr/bin/env python3
"""
Startup script for the SEO Analysis MCP Server.
This can be run as a standalone server for testing.
"""
import asyncio
import logging
from seo_mcp_server import main as run_seo_server

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

async def main():
    """Main function to start the SEO MCP server"""
    print("Starting SEO Analysis MCP Server...")
    print("Press Ctrl+C to stop the server")
    
    try:
        await run_seo_server()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Server error: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())