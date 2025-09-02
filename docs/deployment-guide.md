# Robofy Deployment Guide

This guide provides comprehensive instructions for deploying the Robofy application to a VPS using Hetzner, including CI/CD pipeline setup and autoblogging integration.

## Overview

The Robofy deployment consists of:
- **Frontend**: Next.js 14 application with React 18 and TypeScript
- **Backend**: Python FastAPI server with PostgreSQL database
- **Autoblogging**: AI-powered content generation system
- **CI/CD**: GitHub Actions pipeline for automated testing and deployment
- **Infrastructure**: Docker containers managed via Docker Compose

## Prerequisites

### 1. VPS Requirements
- **Provider**: Hetzner Cloud (or any VPS provider)
- **OS**: Ubuntu 20.04 LTS or newer
- **Specs**: Minimum 2GB RAM, 2 vCPUs, 20GB SSD
- **Domain**: Registered domain name (optional but recommended)

### 2. Local Development Requirements
- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose
- Git

### 3. GitHub Repository Setup
- Repository with Robofy codebase
- GitHub Actions enabled
- Required secrets configured (see below)

## VPS Setup Instructions

### Step 1: Provision Hetzner VPS

1. Create a Hetzner Cloud account at [cloud.hetzner.com](https://cloud.hetzner.com)
2. Create a new project and deploy a Ubuntu 22.04 server
3. Choose appropriate size (CX21 or larger recommended)
4. Note the server IP address and root password

### Step 2: Initial Server Configuration

SSH into your server:
```bash
ssh root@your-server-ip
```

Run the automated setup script:
```bash
wget -O setup-vps.sh https://raw.githubusercontent.com/your-username/robofy/main/scripts/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

### Step 3: Deploy Application

Clone your repository:
```bash
cd /var/www
git clone https://github.com/your-username/robofy.git
cd robofy
```

Copy environment configuration:
```bash
cp .env.example .env.production
# Edit .env.production with your actual values
nano .env.production
```

Start the application:
```bash
systemctl start robofy.service
systemctl status robofy.service
```

## CI/CD Pipeline Configuration

### GitHub Secrets Setup

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

1. `VPS_HOST`: Your server IP address
2. `VPS_USERNAME`: SSH username (usually 'root')
3. `VPS_SSH_KEY`: Private SSH key for server access
4. `DATABASE_URL`: Production database connection string
5. `PRODUCTION_DOMAIN`: Your production domain (if using)

### Pipeline Workflow

The CI/CD pipeline ([`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)) automatically:
1. Runs tests on push to any branch
2. Builds and deploys on push to main branch
3. Generates autoblogging content during build
4. Deploys to VPS via SSH

## Autoblogging Integration

### How It Works

The autoblogging system ([`backend/autoblogging.py`](backend/autoblogging.py)):
- Generates AI content for multiple industries
- Saves content as Markdown files in [`src/content/`](src/content/)
- Integrates with build process via npm scripts

### Build Process Integration

Autoblogging runs automatically during:
- **Local development**: `npm run generate:content`
- **CI/CD pipeline**: Integrated in GitHub Actions
- **Production deployment**: Runs before build

### Manual Content Generation

To generate content manually:
```bash
npm run generate:content
# Or watch mode for development:
npm run dev:content
```

## Docker Deployment

### Container Structure

- **Frontend**: Next.js application on port 3000
- **Backend**: Python FastAPI on port 8000 (internal)
- **Database**: PostgreSQL on port 5432 (internal)
- **Nginx**: Reverse proxy on port 80/443

### Docker Commands

Build and start containers:
```bash
docker-compose up -d --build
```

View logs:
```bash
docker-compose logs -f
```

Stop containers:
```bash
docker-compose down
```

## Environment Configuration

### Required Environment Variables

Create `.env.production` with:

```env
# Database
DATABASE_URL=postgresql://username:password@db:5432/robofy

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Optional: Email service (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## SSL Certificate Setup

### Using Let's Encrypt

Install Certbot on your VPS:
```bash
sudo apt install certbot python3-certbot-nginx
```

Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

The certificate will auto-renew automatically.

## Monitoring and Maintenance

### Log Management

View application logs:
```bash
journalctl -u robofy.service -f
```

Docker container logs:
```bash
docker-compose logs -f app
```

### Backup Procedures

Database backup script:
```bash
#!/bin/bash
docker-compose exec db pg_dump -U postgres robofy > backup/robofy-$(date +%Y%m%d).sql
```

### Performance Monitoring

Install monitoring tools:
```bash
# Install htop for process monitoring
apt install htop

# Install nginx status module
apt install nginx-module-status
```

## Troubleshooting Common Issues

### 1. Docker Compose Fails

**Error**: "Cannot connect to the Docker daemon"
**Solution**: Ensure Docker is running and user has permissions
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### 2. Database Connection Issues

**Error**: "Connection refused"
**Solution**: Check database container status
```bash
docker-compose logs db
```

### 3. Build Failures

**Error**: "npm ERR! missing script"
**Solution**: Ensure all dependencies are installed
```bash
npm ci
cd backend && pip install -r requirements.txt
```

### 4. Autoblogging Content Not Generating

**Error**: No content files created
**Solution**: Check Python dependencies and file permissions
```bash
cd backend && python autoblogging.py --debug
```

### 5. Nginx Configuration Issues

**Error**: 502 Bad Gateway
**Solution**: Check Nginx and application logs
```bash
nginx -t  # Test configuration
systemctl reload nginx
```

## Security Considerations

### 1. Firewall Configuration

Ensure only necessary ports are open:
```bash
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

### 2. Regular Updates

Keep system updated:
```bash
apt update && apt upgrade -y
docker system prune -a  # Clean unused images
```

### 3. Database Security

- Change default PostgreSQL passwords
- Enable SSL connections
- Regular backups

## Performance Optimization

### 1. Caching Strategies

Implement Redis for session caching:
```docker
# Add to docker-compose.yml
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
```

### 2. CDN Integration

Configure Cloudflare or similar CDN for static assets:
- Enable caching for `/_next/static/` and `/static/`
- Set appropriate cache headers

### 3. Database Optimization

Regular maintenance:
```bash
# Analyze and optimize database
docker-compose exec db vacuumdb -U postgres -d robofy -a
```

## Support and Maintenance

### Monitoring Tools

Recommended monitoring setup:
- **Uptime**: UptimeRobot or similar service
- **Performance**: New Relic or Datadog
- **Logs**: Loggly or Papertrail

### Regular Maintenance Tasks

1. **Weekly**: Database backups and log rotation
2. **Monthly**: System updates and security patches
3. **Quarterly**: Performance review and optimization

### Getting Help

- Check the [GitHub Issues](https://github.com/your-username/robofy/issues) page
- Review application logs for error details
- Consult the [Next.js](https://nextjs.org/docs) and [FastAPI](https://fastapi.tiangolo.com/) documentation

## Conclusion

This deployment guide provides a comprehensive approach to deploying and maintaining the Robofy application. The automated CI/CD pipeline ensures consistent deployments, while the Docker-based infrastructure provides reliability and scalability.

For additional support, refer to the component library documentation ([`src/components/ui/design-system.md`](src/components/ui/design-system.md)) and backend API documentation.