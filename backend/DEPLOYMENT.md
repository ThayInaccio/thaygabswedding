# Deployment Guide for Render

This guide explains how to deploy the wedding website backend on Render with automatic database migrations.

## Database Migration System

We've implemented a robust migration system that ensures your database schema is always up to date without affecting existing data.

### Key Features

- **Safe Column Addition**: Automatically adds missing columns without affecting existing data
- **Schema Verification**: Verifies that all required tables and columns exist
- **Transaction Safety**: Uses database transactions to ensure data integrity
- **Detailed Logging**: Provides clear feedback about what changes were made

## Files Created

1. **`src/config/migrate-db.sql`**: Safe migration SQL script
2. **`src/migrate-safe.ts`**: TypeScript migration runner with verification
3. **`deploy.sh`**: Deployment script for Render
4. **`DEPLOYMENT.md`**: This guide

## Available Scripts

```bash
# Run the original migration (destructive)
npm run migrate

# Run the safe migration (recommended for production)
npm run migrate:safe

# Build the application
npm run build

# Start the application
npm start
```

## Render Deployment Setup

### 1. Build Command
```bash
npm run build
```

### 2. Start Command
```bash
./deploy.sh
```

Or alternatively, you can use:
```bash
npm run migrate:safe && npm start
```

### 3. Environment Variables
Make sure to set these environment variables in Render:

- `DATABASE_URL`: Your PostgreSQL connection string
- `PORT`: Port number (Render will set this automatically)
- `FRONTEND_URL`: Your frontend URL for CORS

## How the Safe Migration Works

The safe migration system:

1. **Checks for Missing Columns**: Uses PostgreSQL's `information_schema` to check if columns exist
2. **Adds Columns Safely**: Only adds columns that don't exist, preserving existing data
3. **Creates Tables**: Ensures all required tables exist
4. **Adds Constraints**: Safely adds foreign key constraints and indexes
5. **Verifies Schema**: Provides detailed feedback about the database structure

### Example Migration Output

```
Starting safe database migration...
This will ensure all required tables and columns exist without affecting existing data.
✓ Executed statement successfully
✓ Executed statement successfully
✓ Executed statement successfully
✅ Safe migration completed successfully!

🔍 Verifying database schema...

📋 Gifts table columns:
  - id: uuid (not null)
  - name: character varying (not null)
  - description: text (not null)
  - price: numeric (not null)
  - image_url: text (nullable)
  - is_reserved: boolean (not null)
  - reserved_by: character varying (nullable)
  - reserved_at: timestamp without time zone (nullable)
  - created_at: timestamp without time zone (not null)
  - pix_code: text (nullable)
  - status: character varying (nullable)

✅ All required columns exist in gifts table

📊 Table record counts:
  - Gifts: 10
  - RSVPs: 0
  - Purchases: 0
```

## Troubleshooting

### Migration Fails
If the migration fails, check:
1. Database connection string is correct
2. Database user has sufficient permissions
3. Database is accessible from Render

### Missing Columns
If you see warnings about missing columns, the migration will automatically add them. This is normal for new deployments.

### Data Loss Concerns
The safe migration system is designed to never delete or modify existing data. It only adds missing schema elements.

## Adding New Fields

When you need to add new fields to the database:

1. **Update the TypeScript interfaces** in `src/types/index.ts`
2. **Add the field to the migration script** in `src/config/migrate-db.sql`
3. **Update the model methods** if needed
4. **Deploy**: The migration will automatically add the new field

### Example: Adding a New Field

To add a `category` field to gifts:

1. Update `src/types/index.ts`:
```typescript
export interface Gift {
  // ... existing fields
  category?: string;
}
```

2. Add to `src/config/migrate-db.sql`:
```sql
SELECT add_column_if_not_exists('gifts', 'category', 'VARCHAR(100)');
```

3. Deploy - the field will be automatically added to existing databases.

## Best Practices

1. **Always use safe migrations** in production
2. **Test migrations locally** before deploying
3. **Monitor migration logs** in Render
4. **Backup your database** before major schema changes
5. **Use transactions** for complex migrations

## Local Development

For local development, you can run:

```bash
# Run safe migration
npm run migrate:safe

# Start development server
npm run dev
```

This ensures your local database is always in sync with the latest schema. 