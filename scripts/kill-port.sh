#!/bin/bash

# Script to kill processes running on port 3000
# Usage: ./scripts/kill-port.sh

PORT=8000

echo "Checking for processes using port $PORT..."

# Check if lsof is available
if command -v lsof >/dev/null 2>&1; then
    # Use lsof to find and kill processes
    PID=$(lsof -ti:$PORT)
    if [ -n "$PID" ]; then
        echo "Found processes using port $PORT: $PID"
        echo "Killing processes..."
        kill -9 $PID
        echo "Processes killed."
    else
        echo "No processes found using port $PORT."
    fi
else
    echo "lsof not found. Trying alternative methods..."
    
    # Alternative method using netstat (for Linux)
    if command -v netstat >/dev/null 2>&1; then
        PID=$(netstat -tulpn 2>/dev/null | grep :$PORT | awk '{print $7}' | cut -d'/' -f1)
        if [ -n "$PID" ]; then
            echo "Found processes using port $PORT: $PID"
            echo "Killing processes..."
            kill -9 $PID
            echo "Processes killed."
        else
            echo "No processes found using port $PORT."
        fi
    else
        # Alternative method for macOS
        if command -v sockstat >/dev/null 2>&1; then
            PID=$(sockstat -4 -l -p $PORT | awk 'NR>1 {print $3}')
            if [ -n "$PID" ]; then
                echo "Found processes using port $PORT: $PID"
                echo "Killing processes..."
                kill -9 $PID
                echo "Processes killed."
            else
                echo "No processes found using port $PORT."
            fi
        else
            echo "Neither lsof, netstat, nor sockstat found. Please install lsof for better port management."
            echo "You can install lsof with: brew install lsof (macOS) or apt-get install lsof (Linux)"
        fi
    fi
fi

# Additional check for Node processes that might be using the port
echo "Checking for Node processes that might be using port $PORT..."
NODE_PIDS=$(ps aux | grep node | grep -v grep | awk '{print $2}')
if [ -n "$NODE_PIDS" ]; then
    for PID in $NODE_PIDS; do
        # Check if the process is listening on port 3000 (simplified check)
        if lsof -p $PID | grep ":$PORT" >/dev/null 2>&1; then
            echo "Found Node process $PID using port $PORT. Killing..."
            kill -9 $PID
        fi
    done
fi

echo "Port $PORT should now be free."