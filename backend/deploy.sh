#!/bin/bash

# Deployment script for Render
# This script ensures the database is properly migrated before starting the application

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Build the application
echo "📦 Building application..."
npm run build

# Run safe migration to ensure database schema is up to date
echo "🗄️ Running database migration..."
npm run migrate:safe

# Start the application
echo "🎯 Starting application..."
npm start 