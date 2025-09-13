# Server Management for Robofy AI API

This document describes the various ways to start and manage the Robofy AI API server.

## Startup Options

### 1. Using the Bash Script (Recommended for Development)

The `start_server.sh` script provides a robust way to start the server with port conflict handling.

```bash
# Make the script executable
chmod +x start_server.sh

# Start server in foreground (blocking)
./start_server.sh foreground

# Start server in background with logging
./start_server.sh background

# Check server health
./start_server.sh health

# Stop server
./start_server.sh stop

# Restart server
./start_server.sh restart
```

### 2. Using PM2 (Recommended for Production)

PM2 provides process management, auto-restart, and logging.

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit

# Stop the application
pm2 stop robofy-api

# Restart the application
pm2 restart robofy-api

# Configure PM2 to start on system boot
pm2 startup
pm2 save
```

### 3. Direct Uvicorn Command

For simple cases, you can run uvicorn directly:

```bash
# Explicitly set port 8000 to override any environment variables
uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info
```

## Port Configuration

The server is configured to run on port 8000 by default. If you need to change the port, update:

1. The `PORT` environment variable (but be cautious as it may conflict)
2. The explicit `--port` argument in scripts or commands
3. The PM2 configuration in `ecosystem.config.js`

## Health Check

The server provides a health endpoint at `/api/health`:

```bash
curl http://127.0.0.1:8000/api/health
```

Expected response: `{"status":"healthy"}`

## Troubleshooting

### Port Already in Use

If you encounter port conflicts, use the startup script which automatically kills existing processes on port 8000.

### Server Not Starting

Check the logs:
- For PM2: `pm2 logs robofy-api`
- For bash script: `tail -f server.log`
- For direct execution: check the console output

### Environment Variables

The server reads the `PORT` environment variable with a default of 8000. Ensure this variable is not set to a different value unless intended.

## File Descriptions

- `start_server.sh`: Bash script for robust server management
- `ecosystem.config.js`: PM2 configuration file
- `main.py`: Main FastAPI application file