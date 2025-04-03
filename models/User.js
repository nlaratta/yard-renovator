/**
 * @fileoverview User model for the Yard Renovator application
 * Handles database operations related to users
 * 
 * @module models/User
 */

const db = require('../utils/db');

/**
 * User model class
 * @class User
 */
class User {
  /**
   * Get a user by ID
   * @static
   * @async
   * @param {number} id - User ID
   * @returns {Object|null} User object or null if not found
   */
  static async getById(id) {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get a user by Google ID
   * @static
   * @async
   * @param {string} googleId - Google ID
   * @returns {Object|null} User object or null if not found
   */
  static async getByGoogleId(googleId) {
    try {
      const result = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by Google ID:', error);
      throw error;
    }
  }

  /**
   * Get a user by email
   * @static
   * @async
   * @param {string} email - User email
   * @returns {Object|null} User object or null if not found
   */
  static async getByEmail(email) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Update a user's profile
   * @static
   * @async
   * @param {number} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated user object
   */
  static async update(id, updates) {
    const allowedFields = ['name', 'picture'];
    const updateFields = [];
    const values = [id];
    
    let paramIndex = 2;
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key.toLowerCase()} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    updateFields.push(`updated_at = NOW()`);
    
    const query = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Get user's credit balance
   * @static
   * @async
   * @param {number} id - User ID
   * @returns {number} Credit balance
   */
  static async getCreditBalance(id) {
    try {
      const result = await db.query('SELECT credit_balance FROM users WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      return result.rows[0].credit_balance;
    } catch (error) {
      console.error('Error getting credit balance:', error);
      throw error;
    }
  }

  /**
   * Update user's credit balance
   * @static
   * @async
   * @param {number} id - User ID
   * @param {number} amount - Amount to add/subtract (positive/negative)
   * @returns {Object} Updated user object
   */
  static async updateCreditBalance(id, amount) {
    try {
      return await db.updateUserCredits(id, amount);
    } catch (error) {
      console.error('Error updating credit balance:', error);
      throw error;
    }
  }
}

module.exports = User; 