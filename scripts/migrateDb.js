/**
 * @fileoverview Database migration script
 * This script updates the database schema to fix column types for the Yard Renovator application.
 * 
 * @module scripts/migrateDb
 */

// Load environment variables
require('dotenv').config();

const { Pool } = require('pg');

/**
 * PostgreSQL connection pool
 * @type {Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Run database migrations
 * @async
 * @function migrateDb
 */
async function migrateDb() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migrations...');
    
    await client.query('BEGIN');
    
    // Update the generated_image_url column to TEXT to allow for long base64 data URLs
    console.log('Updating generated_image_url column to TEXT...');
    await client.query(`
      ALTER TABLE image_generation_requests
      ALTER COLUMN generated_image_url TYPE TEXT
    `);
    
    console.log('Migration completed successfully!');
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during migration:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

// Run the migration
migrateDb(); 