#!/bin/bash

# Test script to verify Supervisor configuration for FastMCP server

echo "Testing Supervisor configuration for FastMCP SEO Server..."

# Check if Supervisor is installed
if ! command -v supervisorctl &> /dev/null; then
    echo "Supervisor is not installed. Please install it first."
    echo "On macOS, you can install with: brew install supervisor"
    echo "On Ubuntu: sudo apt-get install supervisor"
    exit 1
fi

# Check the configuration file syntax
if sudo supervisorctl reread; then
    echo "Supervisor configuration syntax is valid."
else
    echo "Error in Supervisor configuration. Please check the file."
    exit 1
fi

# Update Supervisor to load new configuration
sudo supervisorctl update

# Check status of the FastMCP service
echo "Checking FastMCP server status:"
sudo supervisorctl status fastmcp-seo-server

# Instructions for manual control
echo ""
echo "You can control the service with:"
echo "  sudo supervisorctl start fastmcp-seo-server"
echo "  sudo supervisorctl stop fastmcp-seo-server"
echo "  sudo supervisorctl restart fastmcp-seo-server"
echo "  sudo supervisorctl status fastmcp-seo-server"