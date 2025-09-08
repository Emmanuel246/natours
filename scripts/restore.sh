#!/bin/bash

# Database restore script for Natours application
# Usage: ./scripts/restore.sh <backup_file> [database_name]

set -e

# Configuration
BACKUP_FILE=$1
DB_NAME=${2:-natours}

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check arguments
if [[ -z "$BACKUP_FILE" ]]; then
    error "Usage: $0 <backup_file> [database_name]"
fi

# Check if backup file exists
if [[ ! -f "$BACKUP_FILE" ]]; then
    error "Backup file not found: $BACKUP_FILE"
fi

# Check if mongorestore is available
if ! command -v mongorestore &> /dev/null; then
    error "mongorestore is not installed. Please install MongoDB tools."
fi

log "Starting restore of database: $DB_NAME from backup: $BACKUP_FILE"

# Confirm restore operation
warn "This will replace all data in database '$DB_NAME'!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Restore cancelled by user."
    exit 0
fi

# Drop existing database
log "Dropping existing database: $DB_NAME"
mongo "$DB_NAME" --eval "db.dropDatabase()"

# Restore from backup
if mongorestore --db "$DB_NAME" --gzip --archive="$BACKUP_FILE"; then
    log "✅ Database restored successfully!"
    
    # Verify restore
    COLLECTIONS=$(mongo "$DB_NAME" --quiet --eval "db.getCollectionNames().length")
    log "Restored $COLLECTIONS collections"
    
    log "🎉 Restore process completed successfully!"
else
    error "❌ Restore failed!"
fi
