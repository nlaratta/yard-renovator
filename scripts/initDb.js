/**
 * @fileoverview Database initialization script
 * This script creates the necessary database tables for the Yard Renovator application.
 * 
 * @module scripts/initDb
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
 * Initialize the database schema
 * @async
 * @function initDb
 */
async function initDb() {
  const client = await pool.connect();
  
  try {
    console.log('Initializing database...');
    
    await client.query('BEGIN');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        picture VARCHAR(255),
        credit_balance INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);
    
    // Create sessions table for connect-pg-simple
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        CONSTRAINT sessions_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
      )
    `);
    
    // Create index on sessions
    await client.query(`
      CREATE INDEX IF NOT EXISTS IDX_sessions_expire ON sessions (expire)
    `);
    
    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        credits_purchased INTEGER NOT NULL,
        payment_provider VARCHAR(50) NOT NULL,
        payment_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP NOT NULL
      )
    `);
    
    // Create image generation requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS image_generation_requests (
        request_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        renovation_options JSONB NOT NULL,
        generated_image_url VARCHAR(255),
        affiliate_links JSONB,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        completed_at TIMESTAMP
      )
    `);
    
    // Create affiliate cache table
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate_cache (
        product_id VARCHAR(255) PRIMARY KEY,
        affiliate_link VARCHAR(512) NOT NULL,
        product_data JSONB NOT NULL,
        last_updated TIMESTAMP NOT NULL
      )
    `);
    
    await client.query('COMMIT');
    
    console.log('Database initialized successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

// Run the initialization
initDb(); 