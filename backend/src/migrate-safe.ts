import fs from 'fs';
import path from 'path';
import pool from './config/db.config';

async function runSafeMigration() {
  const sqlPath = path.join(__dirname, 'config', 'migrate-db.sql');
  
  if (!fs.existsSync(sqlPath)) {
    console.error('Migration file not found:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf-8');
  
  console.log('Starting safe database migration...');
  console.log('This will ensure all required tables and columns exist without affecting existing data.');
  
  try {
    // Run the migration in a transaction
    await pool.query('BEGIN');
    
    // Split the SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log('✓ Executed statement successfully');
        } catch (error: any) {
          // Log the error but continue with other statements
          console.warn('⚠ Warning executing statement:', error.message);
          console.warn('Statement:', statement.substring(0, 100) + '...');
        }
      }
    }
    
    await pool.query('COMMIT');
    console.log('✅ Safe migration completed successfully!');
    
    // Verify the schema
    await verifySchema();
    
  } catch (err: any) {
    await pool.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function verifySchema() {
  console.log('\n🔍 Verifying database schema...');
  
  try {
    // Check gifts table structure
    const giftsColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'gifts' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Gifts table columns:');
    giftsColumns.rows.forEach((col: any) => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    
    // Check if required columns exist
    const requiredColumns = ['id', 'name', 'description', 'price', 'image_url', 'is_reserved', 'pix_code', 'status'];
    const existingColumns = giftsColumns.rows.map((col: any) => col.column_name);
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.warn('⚠ Missing columns in gifts table:', missingColumns);
    } else {
      console.log('✅ All required columns exist in gifts table');
    }
    
    // Check table counts
    const giftsCount = await pool.query('SELECT COUNT(*) as count FROM gifts');
    const rsvpsCount = await pool.query('SELECT COUNT(*) as count FROM rsvps');
    const purchasesCount = await pool.query('SELECT COUNT(*) as count FROM purchases');
    
    console.log('\n📊 Table record counts:');
    console.log(`  - Gifts: ${giftsCount.rows[0].count}`);
    console.log(`  - RSVPs: ${rsvpsCount.rows[0].count}`);
    console.log(`  - Purchases: ${purchasesCount.rows[0].count}`);
    
  } catch (error: any) {
    console.error('❌ Schema verification failed:', error.message);
  }
}

// Run the migration
runSafeMigration().catch((error) => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
}); 