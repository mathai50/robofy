#!/bin/bash

echo "Starting content generation script..."

# Check if Python is available and attempt content generation
if command -v python3 &> /dev/null; then
    echo "Python 3 found, attempting content generation..."
    if python3 backend/autoblogging.py; then
        echo "Content generation successful."
    else
        echo "Content generation failed, but continuing build."
    fi
elif command -v python &> /dev/null; then
    echo "Python found, attempting content generation..."
    if python backend/autoblogging.py; then
        echo "Content generation successful."
    else
        echo "Content generation failed, but continuing build."
    fi
else
    echo "Python not found, skipping content generation."
fi

echo "Content generation process completed."
exit 0