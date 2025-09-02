#!/bin/bash

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Python 3 found, generating content..."
    python3 backend/autoblogging.py || echo "Content generation failed, but continuing build."
    exit 0
elif command -v python &> /dev/null; then
    echo "Python found, generating content..."
    python backend/autoblogging.py || echo "Content generation failed, but continuing build."
    exit 0
else
    echo "Python not found, skipping content generation."
    exit 0
fi