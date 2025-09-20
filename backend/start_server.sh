#!/bin/bash

# Robust server startup script for Robofy AI API
# Ensures the server runs on port 8000 and handles port conflicts gracefully

set -e  # Exit on any error

PORT=8000
LOG_FILE="server.log"
PID_FILE="server.pid"
VENV_DIR="../.venv"
MAX_RETRIES=3
RETRY_DELAY=2

echo "Starting Robofy AI API server on port $PORT..."

# Function to activate virtual environment
activate_venv() {
    if [ -d "$VENV_DIR" ]; then
        echo "Activating virtual environment..."
        source "$VENV_DIR/bin/activate"
    else
        echo "Virtual environment not found at $VENV_DIR. Please ensure it exists."
        exit 1
    fi
}

# Function to check if port is available
is_port_available() {
    if lsof -ti :$PORT > /dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to kill existing processes on port 8000 with retries
kill_existing_processes() {
    echo "Checking for existing processes on port $PORT..."
    local retries=0
    while [ $retries -lt $MAX_RETRIES ]; do
        if lsof -ti :$PORT > /dev/null 2>&1; then
            echo "Found existing processes on port $PORT. Killing them (attempt $((retries+1))/$MAX_RETRIES)..."
            lsof -ti :$PORT | xargs kill -9
            sleep $RETRY_DELAY
            retries=$((retries+1))
        else
            echo "No existing processes found on port $PORT."
            return 0
        fi
    done
    echo "Failed to free port $PORT after $MAX_RETRIES attempts. Please check manually."
    return 1
}

# Function to start the server
start_server() {
    echo "Starting server with explicit port $PORT..."
    activate_venv
    # Use explicit port setting to override any environment variables
    uvicorn main:app --host 0.0.0.0 --port $PORT --log-level info
}

# Function to start server in background with nohup
start_server_background() {
    echo "Starting server in background on port $PORT..."
    activate_venv
    nohup uvicorn main:app --host 0.0.0.0 --port $PORT --log-level info > $LOG_FILE 2>&1 &
    echo $! > $PID_FILE
    echo "Server started with PID $(cat $PID_FILE). Logs: $LOG_FILE"
}

# Function to check server health
check_health() {
    echo "Checking server health..."
    sleep 3  # Give server time to start
    if curl -f http://127.0.0.1:$PORT/api/health > /dev/null 2>&1; then
        echo "✅ Server is healthy and responding on port $PORT"
        return 0
    else
        echo "❌ Server health check failed on port $PORT"
        return 1
    fi
}

# Main execution
case "${1:-foreground}" in
    foreground)
        kill_existing_processes
        start_server
        ;;
    background)
        kill_existing_processes
        start_server_background
        check_health
        ;;
    health)
        check_health
        ;;
    stop)
        if [ -f "$PID_FILE" ]; then
            echo "Stopping server with PID $(cat $PID_FILE)..."
            kill -9 $(cat $PID_FILE) 2>/dev/null || true
            rm -f $PID_FILE
            echo "Server stopped."
        else
            echo "No PID file found. Killing processes on port $PORT..."
            kill_existing_processes
        fi
        ;;
    restart)
        $0 stop
        sleep 2
        $0 background
        ;;
    *)
        echo "Usage: $0 {foreground|background|health|stop|restart}"
        echo "  foreground: Start server in foreground (blocking)"
        echo "  background: Start server in background with logging"
        echo "  health:     Check server health"
        echo "  stop:       Stop running server"
        echo "  restart:    Restart server"
        exit 1
        ;;
esac