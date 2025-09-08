#!/bin/bash

# Database backup script for Natours application
# Usage: ./scripts/backup.sh [database_name]

set -e

# Configuration
DB_NAME=${1:-natours}
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_$DATE.gz"
RETENTION_DAYS=7

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if mongodump is available
if ! command -v mongodump &> /dev/null; then
    error "mongodump is not installed. Please install MongoDB tools."
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

log "Starting backup of database: $DB_NAME"

# Create backup
if mongodump --db "$DB_NAME" --gzip --archive="$BACKUP_FILE"; then
    log "✅ Backup created successfully: $BACKUP_FILE"
    
    # Get file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "Backup size: $SIZE"
    
    # Clean up old backups
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    log "🎉 Backup process completed successfully!"
else
    error "❌ Backup failed!"
fi
