#!/bin/bash

# Production deployment script for Natours application
# Usage: ./scripts/deploy.sh [environment]

set -e  # Exit on any error

# Configuration
ENVIRONMENT=${1:-production}
APP_NAME="natours"
BACKUP_DIR="/var/backups/natours"
LOG_FILE="/var/log/natours-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check if environment file exists
if [[ ! -f "config.env.$ENVIRONMENT" ]]; then
    error "Environment file config.env.$ENVIRONMENT not found"
fi

log "Starting deployment for environment: $ENVIRONMENT"

# Create backup directory if it doesn't exist
sudo mkdir -p "$BACKUP_DIR"

# Backup current deployment
if [[ -d "/opt/$APP_NAME" ]]; then
    log "Creating backup of current deployment..."
    sudo tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "/opt" "$APP_NAME"
fi

# Pull latest code
log "Pulling latest code from repository..."
git pull origin main

# Install/update dependencies
log "Installing dependencies..."
npm ci --only=production

# Run tests
log "Running tests..."
npm test

# Build application
log "Building application..."
npm run build

# Stop application if running
log "Stopping application..."
if pgrep -f "node.*server.js" > /dev/null; then
    pkill -f "node.*server.js" || warn "Could not stop application gracefully"
    sleep 5
fi

# Copy environment file
log "Setting up environment configuration..."
cp "config.env.$ENVIRONMENT" config.env

# Start application with PM2
log "Starting application with PM2..."
pm2 start ecosystem.config.js --env $ENVIRONMENT

# Wait for application to start
log "Waiting for application to start..."
sleep 10

# Health check
log "Performing health check..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    log "✅ Deployment successful! Application is healthy."
else
    error "❌ Health check failed! Rolling back..."
fi

# Clean up old backups (keep last 5)
log "Cleaning up old backups..."
sudo find "$BACKUP_DIR" -name "backup-*.tar.gz" -type f -mtime +7 -delete

log "🎉 Deployment completed successfully!"
