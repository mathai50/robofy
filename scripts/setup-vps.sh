#!/bin/bash

# Robofy VPS Setup Script for Hetzner
# This script sets up a fresh Ubuntu VPS with Docker, Nginx, and necessary dependencies

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run this script as root"
    exit 1
fi

# Update system and install basic dependencies
log_info "Updating system packages..."
apt-get update
apt-get upgrade -y

log_info "Installing basic dependencies..."
apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
log_info "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
log_info "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js (for PM2 and additional tooling)
log_info "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 for process management
log_info "Installing PM2..."
npm install -g pm2

# Create application directory
log_info "Creating application directory..."
mkdir -p /var/www/robofy
chown -R $SUDO_USER:$SUDO_USER /var/www/robofy

# Setup firewall
log_info "Configuring firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Create systemd service for auto-start
log_info "Creating systemd service for Robofy..."
cat > /etc/systemd/system/robofy.service << EOF
[Unit]
Description=Robofy Application
After=network.target

[Service]
Type=simple
User=$SUDO_USER
WorkingDirectory=/var/www/robofy
ExecStart=/usr/local/bin/docker-compose up
ExecStop=/usr/local/bin/docker-compose down
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl daemon-reload
systemctl enable robofy.service

log_info "VPS setup completed successfully!"
log_info "Next steps:"
log_info "1. Clone your repository to /var/www/robofy"
log_info "2. Copy .env.production file with your configuration"
log_info "3. Run: systemctl start robofy.service"
log_info "4. Check status: systemctl status robofy.service"