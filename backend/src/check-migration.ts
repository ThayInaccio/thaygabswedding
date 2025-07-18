import pool from './config/db.config';

async function checkMigration() {
  try {
    console.log('🔍 Checking database migration status...');
    
    // Check if gifts table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'gifts'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ Gifts table does not exist. Migration needed.');
      return;
    }
    
    // Check gifts table columns
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'gifts' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Gifts table columns:');
    columns.rows.forEach((col: any) => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    
    // Check for required columns
    const requiredColumns = ['id', 'name', 'description', 'price', 'image_url', 'is_reserved', 'pix_code', 'status'];
    const existingColumns = columns.rows.map((col: any) => col.column_name);
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('\n⚠️ Missing columns:', missingColumns);
      console.log('🔧 Run migration with: npm run migrate:safe');
    } else {
      console.log('\n✅ All required columns exist!');
    }
    
    // Check record count
    const count = await pool.query('SELECT COUNT(*) as count FROM gifts');
    console.log(`\n📊 Total gifts: ${count.rows[0].count}`);
    
  } catch (error: any) {
    console.error('❌ Error checking migration:', error.message);
  } finally {
    await pool.end();
  }
}

checkMigration(); 