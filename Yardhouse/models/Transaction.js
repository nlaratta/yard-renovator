/**
 * @fileoverview Transaction model for the Yard Renovator application
 * Handles database operations related to payment transactions
 * 
 * @module models/Transaction
 */

const db = require('../utils/db');

/**
 * Transaction model class
 * @class Transaction
 */
class Transaction {
  /**
   * Create a new transaction record
   * @static
   * @async
   * @param {Object} transactionData - Transaction data
   * @param {number} transactionData.userId - User ID
   * @param {number} transactionData.amount - Payment amount
   * @param {number} transactionData.creditsAmount - Number of credits purchased
   * @param {string} transactionData.provider - Payment provider (e.g., 'PayPal')
   * @param {string} transactionData.paymentId - Payment ID from provider
   * @param {string} transactionData.status - Transaction status
   * @returns {Object} Created transaction record
   */
  static async create({ userId, amount, creditsAmount, provider, paymentId, status }) {
    try {
      const result = await db.recordTransaction({ 
        userId, 
        amount, 
        creditsAmount, 
        provider, 
        paymentId, 
        status 
      });
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Get a transaction by ID
   * @static
   * @async
   * @param {number} transactionId - Transaction ID
   * @returns {Object|null} Transaction object or null if not found
   */
  static async getById(transactionId) {
    try {
      const result = await db.query(
        'SELECT * FROM transactions WHERE transaction_id = $1',
        [transactionId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting transaction by ID:', error);
      throw error;
    }
  }

  /**
   * Update transaction status
   * @static
   * @async
   * @param {number} transactionId - Transaction ID
   * @param {string} status - New status
   * @returns {Object} Updated transaction object
   */
  static async updateStatus(transactionId, status) {
    try {
      const result = await db.query(
        'UPDATE transactions SET status = $1 WHERE transaction_id = $2 RETURNING *',
        [status, transactionId]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  /**
   * Get transactions by user ID
   * @static
   * @async
   * @param {number} userId - User ID
   * @param {number} [limit=10] - Maximum number of transactions to return
   * @param {number} [offset=0] - Offset for pagination
   * @returns {Array} Array of transaction objects
   */
  static async getByUserId(userId, limit = 10, offset = 0) {
    try {
      const result = await db.query(
        'SELECT * FROM transactions WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting transactions by user ID:', error);
      throw error;
    }
  }

  /**
   * Get transaction count by user ID
   * @static
   * @async
   * @param {number} userId - User ID
   * @returns {number} Transaction count
   */
  static async getCountByUserId(userId) {
    try {
      const result = await db.query(
        'SELECT COUNT(*) FROM transactions WHERE user_id = $1',
        [userId]
      );
      
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error getting transaction count:', error);
      throw error;
    }
  }

  /**
   * Get credit package information
   * @static
   * @returns {Array} Credit package options
   */
  static getCreditPackages() {
    return [
      { id: 'single', credits: 1, amount: 0.49, name: 'Single credit' },
      { id: 'small', credits: 3, amount: 1.29, name: '3 credits' },
      { id: 'medium', credits: 5, amount: 1.99, name: '5 credits' },
      { id: 'large', credits: 10, amount: 3.00, name: '10 credits' }
    ];
  }

  /**
   * Get credit package by ID
   * @static
   * @param {string} packageId - Package ID
   * @returns {Object|null} Credit package or null if not found
   */
  static getCreditPackageById(packageId) {
    const packages = this.getCreditPackages();
    return packages.find(pkg => pkg.id === packageId) || null;
  }
}

module.exports = Transaction; 