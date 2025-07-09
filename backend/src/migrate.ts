import fs from 'fs';
import path from 'path';
import pool from './config/db.config';

async function runMigration() {
  const sqlPath = path.join(__dirname, 'config', 'init-db.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  try {
    // Split on semicolon followed by newline to avoid issues with procedural blocks
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
    for (const statement of statements) {
      if (statement) {
        await pool.query(statement);
      }
    }
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration(); 