import pg from 'pg';

const { Pool } = pg;

// Update these values or use environment variables as needed
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'wedding_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

async function main() {
  const res = await pool.query('SELECT name FROM rsvps');
  const names = res.rows.map(row => row.name.trim().toLowerCase());

  const seen = new Set();
  const duplicates = new Set();

  for (const name of names) {
    if (seen.has(name)) {
      duplicates.add(name);
    } else {
      seen.add(name);
    }
  }

  if (duplicates.size > 0) {
    console.log('Duplicate guest names found:');
    for (const name of duplicates) {
      console.log(name);
    }
  } else {
    console.log('No duplicate guest names found.');
  }

  await pool.end();
}

main(); 