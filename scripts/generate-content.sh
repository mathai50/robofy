#!/bin/bash

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Python 3 found, generating content..."
    python3 backend/autoblogging.py
elif command -v python &> /dev/null; then
    echo "Python found, generating content..."
    python backend/autoblogging.py
else
    echo "Python not found, skipping content generation."
    exit 0
fi