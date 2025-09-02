#!/bin/bash

# Robofy Deployment Test Script
# This script tests the deployment process locally to ensure everything works

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

log_info "Starting Robofy deployment test..."

# Test 1: Build the Docker image
log_info "Test 1: Building Docker image..."
if docker build -t robofy-test .; then
    log_info "Docker build successful"
else
    log_error "Docker build failed"
    exit 1
fi

# Test 2: Run autoblogging generation
log_info "Test 2: Testing autoblogging generation..."
if npm run generate:content; then
    log_info "Autoblogging generation successful"
else
    log_error "Autoblogging generation failed"
    exit 1
fi

# Test 3: Build the Next.js application
log_info "Test 3: Building Next.js application..."
if npm run build; then
    log_info "Next.js build successful"
else
    log_error "Next.js build failed"
    exit 1
fi

# Test 4: Start services with Docker Compose
log_info "Test 4: Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to start
sleep 10

# Test 5: Check if the application is running
log_info "Test 5: Checking application health..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    log_info "Application is healthy and running"
else
    log_error "Application health check failed"
    docker-compose logs
    exit 1
fi

# Test 6: Check if autoblogging content is accessible
log_info "Test 6: Checking autoblogging content..."
if [ -d "src/content" ] && [ "$(ls -A src/content)" ]; then
    log_info "Autoblogging content directory exists and has files"
else
    log_error "Autoblogging content directory is missing or empty"
    exit 1
fi

# Test 7: Clean up
log_info "Test 7: Cleaning up..."
docker-compose down

log_info "All deployment tests passed successfully!"
log_info "The application is ready for production deployment."