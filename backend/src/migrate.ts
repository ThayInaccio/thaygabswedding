import fs from 'fs';
import path from 'path';
import pool from './config/db.config';

async function runMigration() {
  const sqlPath = path.join(__dirname, 'config', 'init-db.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  try {
    // Run the entire SQL file as a single query to support procedural blocks
    await pool.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration(); 