#!/bin/bash

# Deployment script for Render
# This script ensures the database is properly migrated before starting the application

set -e  # Exit on any error

echo "🚀 Starting deployment process..."
echo "📅 Deployment time: $(date)"
echo "🌍 Environment: $NODE_ENV"

# Check if we're in a production environment
if [ "$NODE_ENV" = "production" ]; then
    echo "🏭 Production environment detected"
fi

# Build the application
echo "📦 Building application..."
npm run build
echo "✅ Build completed successfully"

# Check if migration script exists
if [ ! -f "src/migrate-safe.ts" ]; then
    echo "❌ Migration script not found!"
    exit 1
fi

# Run simple migration to ensure database schema is up to date
echo "🗄️ Running database migration..."
echo "🔍 Checking database connection..."
npm run migrate:simple
echo "✅ Migration completed successfully"

# Verify migration was successful
echo "🔍 Verifying migration..."
npm run check-migration

# Start the application
echo "🎯 Starting application..."
echo "🚀 Application starting at $(date)"
npm start 