#!/bin/bash

# FastMCP SEO Server Management Script
# This script provides graceful control of the FastMCP server with proper process management
# Enhanced with health checks, robustness features, and better error handling

# Get the directory of this script to make paths relative and portable
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Configuration - customizable via environment variables
SERVER_PID_FILE="${FASTMCP_PID_FILE:-/tmp/fastmcp-seo-server.pid}"
LOG_FILE="${FASTMCP_LOG_FILE:-/tmp/fastmcp-seo-server.log}"
ERROR_LOG_FILE="${FASTMCP_ERROR_LOG_FILE:-/tmp/fastmcp-seo-server.error.log}"
PORT="${FASTMCP_PORT:-8001}"
HEALTH_CHECK_TIMEOUT="${FASTMCP_HEALTH_TIMEOUT:-30}"
STARTUP_TIMEOUT="${FASTMCP_STARTUP_TIMEOUT:-60}"

# Function to check if port is in use
check_port() {
    lsof -ti:$PORT > /dev/null 2>&1
    return $?
}

# Function to kill processes on port gracefully
kill_port_processes() {
    echo "Stopping processes on port $PORT..."
    
    # First try graceful SIGTERM
    lsof -ti:$PORT | xargs kill -15 > /dev/null 2>&1 || true
    sleep 3
    
    # If still running, force kill with SIGKILL
    if check_port; then
        echo "Processes still running on port $PORT, forcing termination..."
        lsof -ti:$PORT | xargs kill -9 > /dev/null 2>&1 || true
        sleep 2
        # Double-check and force kill if needed
        lsof -ti:$PORT | xargs kill -9 > /dev/null 2>&1 || true
    fi
}

# Function to check server health with HTTP request
check_server_health() {
    local timeout=$1
    local start_time=$(date +%s)
    
    while [ $(($(date +%s) - start_time)) -lt $timeout ]; do
        if curl -f -s -o /dev/null "http://localhost:$PORT/health" 2>/dev/null; then
            return 0
        fi
        sleep 2
    done
    return 1
}

# Function to start the server in background with health check
start_server() {
    echo "Starting FastMCP SEO Server in background..."
    
    # Check if port is already in use
    if check_port; then
        echo "Port $PORT is already in use. Stopping existing processes..."
        kill_port_processes
    fi
    
    # Change to backend directory and start server
    cd "$SCRIPT_DIR"
    
    # Check if virtual environment exists
    if [ ! -f ".venv/bin/activate" ]; then
        echo "Error: Virtual environment not found at $SCRIPT_DIR/.venv/bin/activate"
        echo "Please create the virtual environment with: python -m venv .venv"
        exit 1
    fi
    
    source .venv/bin/activate
    
    # Check if fastmcp is installed
    if ! command -v fastmcp &> /dev/null; then
        echo "Error: fastmcp command not found. Please install it in the virtual environment."
        echo "Run: pip install fastmcp"
        exit 1
    fi
    
    # Create log directory if it doesn't exist
    mkdir -p "$(dirname "$LOG_FILE")"
    mkdir -p "$(dirname "$ERROR_LOG_FILE")"
    
    # Start the server in background and capture PID
    echo "$(date): Starting FastMCP server on port $PORT" >> "$LOG_FILE"
    fastmcp run seo_mcp_server_fastmcp.py --transport http --port $PORT >> "$LOG_FILE" 2>> "$ERROR_LOG_FILE" &
    SERVER_PID=$!
    
    # Save PID to file
    echo $SERVER_PID > "$SERVER_PID_FILE"
    echo "Server starting with PID: $SERVER_PID"
    echo "Logs: $LOG_FILE"
    echo "Error logs: $ERROR_LOG_FILE"
    
    # Wait for server to start with health check
    echo "Waiting for server to become healthy (timeout: ${STARTUP_TIMEOUT}s)..."
    if check_server_health $STARTUP_TIMEOUT; then
        echo "Server started successfully and is responding to health checks"
        echo "$(date): Server started successfully with PID $SERVER_PID" >> "$LOG_FILE"
    else
        echo "Error: Server failed to start within $STARTUP_TIMEOUT seconds or health check failed"
        echo "Check the error logs: $ERROR_LOG_FILE"
        echo "$(date): Server failed to start or health check failed" >> "$ERROR_LOG_FILE"
        # Clean up the process
        kill -9 $SERVER_PID 2>/dev/null || true
        rm -f "$SERVER_PID_FILE"
        exit 1
    fi
}

# Function to start the server in foreground (for Supervisor/systemd)
start_foreground() {
    echo "Starting FastMCP SEO Server in foreground..."
    
    # Check if port is already in use
    if check_port; then
        echo "Port $PORT is already in use. Stopping existing processes..."
        kill_port_processes
    fi
    
    # Change to backend directory
    cd "$SCRIPT_DIR"
    
    # Check if virtual environment exists
    if [ ! -f ".venv/bin/activate" ]; then
        echo "Error: Virtual environment not found at $SCRIPT_DIR/.venv/bin/activate"
        echo "Please create the virtual environment with: python -m venv .venv"
        exit 1
    fi
    
    source .venv/bin/activate
    
    # Check if fastmcp is installed
    if ! command -v fastmcp &> /dev/null; then
        echo "Error: fastmcp command not found. Please install it in the virtual environment."
        echo "Run: pip install fastmcp"
        exit 1
    fi
    
    # Start the server in foreground
    echo "$(date): Starting FastMCP server in foreground on port $PORT" >> "$LOG_FILE"
    exec fastmcp run seo_mcp_server_fastmcp.py --transport http --port $PORT
}

# Function to stop the server gracefully
stop_server() {
    echo "Stopping FastMCP SEO Server..."
    
    # Kill by PID if available (graceful first)
    if [ -f "$SERVER_PID_FILE" ]; then
        PID=$(cat "$SERVER_PID_FILE")
        echo "Sending SIGTERM to process $PID..."
        kill -15 $PID > /dev/null 2>&1 || true
        
        # Wait for graceful shutdown
        local wait_time=10
        local count=0
        while kill -0 $PID 2>/dev/null && [ $count -lt $wait_time ]; do
            sleep 1
            count=$((count + 1))
        done
        
        # If still running, force kill
        if kill -0 $PID 2>/dev/null; then
            echo "Process $PID not responding to SIGTERM, forcing termination..."
            kill -9 $PID > /dev/null 2>&1 || true
        fi
        
        rm -f "$SERVER_PID_FILE"
        echo "$(date): Server stopped (PID: $PID)" >> "$LOG_FILE"
    fi
    
    # Ensure port is cleared
    kill_port_processes
    
    echo "Server stopped successfully."
}

# Function to check server status with health verification
status_server() {
    if check_port; then
        echo "Server process is running on port $PORT"
        echo "Process details:"
        lsof -i :$PORT
        
        # Check if server is actually healthy
        echo -n "Health check: "
        if check_server_health $HEALTH_CHECK_TIMEOUT; then
            echo "✅ Healthy - server responding to requests"
        else
            echo "❌ Unhealthy - server not responding to health checks"
            return 1
        fi
    else
        echo "Server is not running"
        return 1
    fi
}

# Function to view server logs
view_logs() {
    if [ -f "$LOG_FILE" ]; then
        echo "=== Server Logs (last 50 lines) ==="
        tail -50 "$LOG_FILE"
    else
        echo "No log file found at $LOG_FILE"
    fi
    
    if [ -f "$ERROR_LOG_FILE" ]; then
        echo ""
        echo "=== Error Logs (last 20 lines) ==="
        tail -20 "$ERROR_LOG_FILE"
    fi
}

# Function to monitor server in real-time
monitor_server() {
    echo "Starting real-time monitoring of FastMCP server..."
    echo "Press Ctrl+C to stop monitoring"
    echo ""
    
    while true; do
        clear
        echo "=== FastMCP Server Monitor ==="
        echo "Timestamp: $(date)"
        echo ""
        
        # Check status
        if check_port; then
            echo "Status: ✅ Running on port $PORT"
            
            # Quick health check
            if curl -f -s -o /dev/null "http://localhost:$PORT/health" --max-time 5; then
                echo "Health:  ✅ Responding"
            else
                echo "Health:  ⚠️  Slow response or unhealthy"
            fi
            
            # Show process info
            echo ""
            echo "Process Information:"
            ps -p $(lsof -ti:$PORT | head -1) -o pid,user,%cpu,%mem,command 2>/dev/null || echo "No process details available"
        else
            echo "Status: ❌ Not running"
        fi
        
        # Show recent logs
        echo ""
        echo "Recent Log Activity:"
        tail -5 "$LOG_FILE" 2>/dev/null || echo "No log activity"
        
        sleep 5
    done
}

# Function to display usage information
show_usage() {
    echo "Usage: $0 {start|start-foreground|stop|restart|status|logs|monitor}"
    echo ""
    echo "Commands:"
    echo "  start              Start the server in background with health checks"
    echo "  start-foreground   Start the server in foreground (for process managers)"
    echo "  stop               Stop the server gracefully"
    echo "  restart            Restart the server"
    echo "  status             Check server status and health"
    echo "  logs               View server logs"
    echo "  monitor            Real-time server monitoring"
    echo ""
    echo "Environment Variables:"
    echo "  FASTMCP_PORT              Server port (default: 8001)"
    echo "  FASTMCP_PID_FILE          PID file path (default: /tmp/fastmcp-seo-server.pid)"
    echo "  FASTMCP_LOG_FILE          Log file path (default: /tmp/fastmcp-seo-server.log)"
    echo "  FASTMCP_ERROR_LOG_FILE    Error log file path (default: /tmp/fastmcp-seo-server.error.log)"
    echo "  FASTMCP_HEALTH_TIMEOUT    Health check timeout in seconds (default: 30)"
    echo "  FASTMCP_STARTUP_TIMEOUT   Startup timeout in seconds (default: 60)"
}

# Main command handling
case "$1" in
    start)
        start_server
        ;;
    start-foreground)
        start_foreground
        ;;
    stop)
        stop_server
        ;;
    restart)
        echo "Restarting FastMCP server..."
        stop_server
        sleep 2
        start_server
        ;;
    status)
        status_server
        ;;
    logs)
        view_logs
        ;;
    monitor)
        monitor_server
        ;;
    *)
        show_usage
        exit 1
        ;;
esac