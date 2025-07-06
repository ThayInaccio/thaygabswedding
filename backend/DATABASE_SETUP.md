# Database Setup Guide

## 🚨 Error: "database 'wedding_db' does not exist"

This error occurs because the PostgreSQL database hasn't been created yet. Follow these steps to fix it:

## 📋 Prerequisites

1. **PostgreSQL installed** on your system
2. **PostgreSQL service running**
3. **Superuser access** (usually 'postgres' user)

## 🔧 Step-by-Step Setup

### Option 1: Using Command Line (Recommended)

1. **Open Terminal/Command Prompt**

2. **Connect to PostgreSQL as superuser:**
   ```bash
   # On macOS/Linux
   sudo -u postgres psql
   
   # On Windows (if using default installation)
   psql -U postgres
   
   # Or if you have a custom setup
   psql -U your_postgres_user -h localhost
   ```

3. **Run the setup script:**
   ```bash
   \i backend/scripts/setup-db.sql
   ```

4. **Verify the setup:**
   ```sql
   \l  -- List all databases (should see wedding_db)
   \c wedding_db  -- Connect to wedding_db
   \dt  -- List tables (should see rsvps and gifts)
   ```

### Option 2: Using pgAdmin

1. **Open pgAdmin**

2. **Connect to your PostgreSQL server**

3. **Right-click on "Databases" → "Create" → "Database"**
   - Name: `wedding_db`
   - Owner: `postgres` (or your app user)

4. **Right-click on the new `wedding_db` database → "Query Tool"**

5. **Copy and paste the contents of `backend/scripts/setup-db.sql`**

6. **Click "Execute" (F5)**

### Option 3: Manual Commands

If the script doesn't work, run these commands manually:

```sql
-- 1. Create database
CREATE DATABASE wedding_db;

-- 2. Connect to the database
\c wedding_db;

-- 3. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Create tables (copy from setup-db.sql)
-- ... (rest of the SQL commands)
```

## 🔐 Environment Configuration

1. **Copy the environment file:**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Edit `.env` with your database credentials:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wedding_db
   DB_USER=postgres
   DB_PASSWORD=your_actual_password
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

## 🧪 Test the Setup

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check the console output** - you should see:
   ```
   Connected to PostgreSQL database
   Server running on port 3001
   ```

3. **Test the API endpoints:**
   ```bash
   # Test gifts endpoint
   curl http://localhost:3001/api/gifts
   
   # Test RSVP endpoint
   curl http://localhost:3001/api/rsvp
   ```

## 🐛 Troubleshooting

### Common Issues:

1. **"Permission denied"**
   - Make sure you're running as a PostgreSQL superuser
   - Check your PostgreSQL installation

2. **"Connection refused"**
   - Ensure PostgreSQL service is running
   - Check if the port (5432) is correct

3. **"User authentication failed"**
   - Verify your database credentials in `.env`
   - Check if the user exists and has proper permissions

4. **"Extension uuid-ossp does not exist"**
   - This extension should be available by default
   - If not, you may need to install additional PostgreSQL extensions

### Reset Database (if needed):

```sql
-- Drop and recreate the database
DROP DATABASE IF EXISTS wedding_db;
CREATE DATABASE wedding_db;
\c wedding_db;
-- Then run the setup script again
```

## ✅ Verification

After setup, you should have:

- ✅ Database `wedding_db` created
- ✅ Tables `rsvps` and `gifts` created
- ✅ Sample data inserted
- ✅ Backend server connecting successfully
- ✅ API endpoints responding

## 📞 Need Help?

If you're still having issues:

1. Check PostgreSQL logs: `tail -f /var/log/postgresql/postgresql-*.log`
2. Verify PostgreSQL is running: `sudo systemctl status postgresql`
3. Test connection: `psql -U postgres -d wedding_db -c "SELECT 1;"`

The database should now be properly set up and your backend should work without the "database does not exist" error! 