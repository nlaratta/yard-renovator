/**
 * @fileoverview Database utility functions
 * Provides common database operations for the application
 * 
 * @module utils/db
 */

const { Pool } = require('pg');

/**
 * PostgreSQL connection pool instance
 * @type {Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Execute a query with parameters
 * @async
 * @function query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Object} Query result
 */
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool
 * @async
 * @function getClient
 * @returns {Object} Database client
 */
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Override client.query to add logging
  client.query = (...args) => {
    return query.apply(client, args);
  };
  
  // Override client.release to ensure client is not released twice
  client.release = () => {
    release.apply(client);
  };
  
  return client;
};

/**
 * Update a user's credit balance
 * @async
 * @function updateUserCredits
 * @param {number} userId - User ID
 * @param {number} amount - Amount to add/subtract (positive/negative)
 * @returns {Object} Updated user
 */
const updateUserCredits = async (userId, amount) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    // Get current balance
    const currentBalanceResult = await client.query(
      'SELECT credit_balance FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );
    
    if (currentBalanceResult.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const currentBalance = currentBalanceResult.rows[0].credit_balance;
    const newBalance = currentBalance + amount;
    
    // Check if resulting balance would be negative
    if (newBalance < 0) {
      throw new Error('Insufficient credits');
    }
    
    // Update balance
    const updateResult = await client.query(
      'UPDATE users SET credit_balance = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newBalance, userId]
    );
    
    await client.query('COMMIT');
    
    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Record a credit transaction
 * @async
 * @function recordTransaction
 * @param {Object} transaction - Transaction details
 * @param {number} transaction.userId - User ID
 * @param {number} transaction.amount - Payment amount
 * @param {number} transaction.creditsAmount - Number of credits purchased
 * @param {string} transaction.provider - Payment provider (e.g., 'PayPal')
 * @param {string} transaction.paymentId - Payment ID from provider
 * @param {string} transaction.status - Transaction status
 * @returns {Object} Created transaction record
 */
const recordTransaction = async ({ userId, amount, creditsAmount, provider, paymentId, status }) => {
  return await query(
    'INSERT INTO transactions (user_id, amount, credits_purchased, payment_provider, payment_id, status, timestamp) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
    [userId, amount, creditsAmount, provider, paymentId, status]
  );
};

/**
 * Create an image generation request
 * @async
 * @function createImageRequest
 * @param {Object} request - Request details
 * @param {number} request.userId - User ID
 * @param {Object} request.renovationOptions - Renovation options
 * @param {string} request.originalImagePath - Path to the uploaded image
 * @returns {Object} Created request record
 */
const createImageRequest = async ({ userId, renovationOptions, originalImagePath }) => {
  return await query(
    'INSERT INTO image_generation_requests (user_id, renovation_options, original_image_path, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [userId, renovationOptions, originalImagePath, 'processing']
  );
};

/**
 * Update an image generation request
 * @async
 * @function updateImageRequest
 * @param {number} requestId - Request ID
 * @param {Object} updates - Fields to update
 * @param {string} [updates.status] - New status
 * @param {string} [updates.generatedImageUrl] - Generated image URL (camelCase)
 * @param {Object} [updates.affiliateLinks] - Affiliate links (camelCase)
 * @returns {Object} Updated request record
 */
const updateImageRequest = async (requestId, updates) => {
  let updateFields = [];
  let params = [requestId];
  let idx = 2;
  
  if (updates.status) {
    updateFields.push(`status = $${idx++}`);
    params.push(updates.status);
  }
  
  // Handle both camelCase and snake_case property names
  const imageUrl = updates.generatedImageUrl || updates.imageUrl;
  if (imageUrl) {
    updateFields.push(`generated_image_url = $${idx++}`);
    params.push(imageUrl);
  }
  
  // Handle both camelCase and snake_case property names
  const affiliateLinks = updates.affiliateLinks || updates.affiliateLinks;
  if (affiliateLinks) {
    updateFields.push(`affiliate_links = $${idx++}`);
    // Make sure the affiliate links are properly stringified as JSON
    try {
      if (typeof affiliateLinks === 'string') {
        // If it's already a string, verify it's valid JSON
        JSON.parse(affiliateLinks);
        params.push(affiliateLinks);
      } else {
        // Otherwise, stringify the object
        params.push(JSON.stringify(affiliateLinks));
      }
    } catch (err) {
      console.error('Error preparing affiliate links for database:', err);
      throw new Error('Invalid JSON format for affiliate links');
    }
  }
  
  if (updates.status === 'completed') {
    updateFields.push(`completed_at = NOW()`);
  }
  
  if (updateFields.length === 0) {
    throw new Error('No fields to update');
  }
  
  return await query(
    `UPDATE image_generation_requests SET ${updateFields.join(', ')} WHERE request_id = $1 RETURNING *`,
    params
  );
};

/**
 * Cache an affiliate product
 * @async
 * @function cacheAffiliateProduct
 * @param {Object} product - Product details
 * @param {string} product.productId - Amazon product ID
 * @param {string} product.affiliateLink - Affiliate link
 * @param {Object} product.productData - Product data
 * @returns {Object} Cached product record
 */
const cacheAffiliateProduct = async ({ productId, affiliateLink, productData }) => {
  return await query(
    'INSERT INTO affiliate_cache (product_id, affiliate_link, product_data, last_updated) VALUES ($1, $2, $3, NOW()) ' +
    'ON CONFLICT (product_id) DO UPDATE SET affiliate_link = $2, product_data = $3, last_updated = NOW() RETURNING *',
    [productId, affiliateLink, productData]
  );
};

module.exports = {
  query,
  getClient,
  updateUserCredits,
  recordTransaction,
  createImageRequest,
  updateImageRequest,
  cacheAffiliateProduct
}; 