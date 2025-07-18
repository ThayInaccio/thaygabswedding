import fs from 'fs';
import path from 'path';
import pool from './config/db.config';

async function runSimpleMigration() {
  const sqlPath = path.join(__dirname, 'config', 'simple-migrate.sql');
  
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Simple migration file not found:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf-8');
  
  console.log('🚀 Starting simple database migration...');
  console.log('📅 Migration time:', new Date().toISOString());
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  
  try {
    console.log('🔌 Connecting to database...');
    
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    console.log('🗄️ Running migration...');
    
    // Execute the migration
    await pool.query(sql);
    
    console.log('✅ Simple migration completed successfully!');
    
    // Verify the migration
    await verifyMigration();
    
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  try {
    // Check if pix_code column exists
    const pixCodeExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gifts' AND column_name = 'pix_code'
      );
    `);
    
    if (pixCodeExists.rows[0].exists) {
      console.log('✅ pix_code column exists');
    } else {
      console.log('❌ pix_code column missing');
    }
    
    // Check if status column exists
    const statusExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gifts' AND column_name = 'status'
      );
    `);
    
    if (statusExists.rows[0].exists) {
      console.log('✅ status column exists');
    } else {
      console.log('❌ status column missing');
    }
    
    // Check record count
    const count = await pool.query('SELECT COUNT(*) as count FROM gifts');
    console.log(`📊 Total gifts: ${count.rows[0].count}`);
    
  } catch (error: any) {
    console.error('❌ Verification failed:', error.message);
  }
}

// Run the migration
runSimpleMigration().catch((error) => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
}); 