/**
 * @fileoverview ImageRequest model for the Yard Renovator application
 * Handles database operations related to image generation requests
 * 
 * @module models/ImageRequest
 */

const db = require('../utils/db');

/**
 * ImageRequest model class
 * @class ImageRequest
 */
class ImageRequest {
  /**
   * Create a new image generation request
   * @static
   * @async
   * @param {Object} requestData - Request data
   * @param {number} requestData.userId - User ID
   * @param {Object} requestData.renovationOptions - Renovation options
   * @param {string} requestData.originalImagePath - Path to the uploaded image
   * @returns {Object} Created image request
   */
  static async create({ userId, renovationOptions, originalImagePath }) {
    try {
      const result = await db.query(
        'INSERT INTO image_generation_requests (user_id, renovation_options, original_image_path, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [userId, renovationOptions, originalImagePath, 'processing']
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating image request:', error);
      throw error;
    }
  }

  /**
   * Get an image request by ID
   * @static
   * @async
   * @param {number} requestId - Request ID
   * @returns {Object|null} Image request object or null if not found
   */
  static async getById(requestId) {
    try {
      const result = await db.query(
        'SELECT * FROM image_generation_requests WHERE request_id = $1',
        [requestId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting image request by ID:', error);
      throw error;
    }
  }

  /**
   * Update an image request
   * @static
   * @async
   * @param {number} requestId - Request ID
   * @param {Object} updates - Fields to update
   * @param {string} [updates.status] - New status
   * @param {string} [updates.generatedImageUrl] - Generated image URL
   * @param {Object} [updates.affiliateLinks] - Affiliate links
   * @returns {Object} Updated image request
   */
  static async update(requestId, updates) {
    try {
      const result = await db.updateImageRequest(requestId, updates);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating image request:', error);
      throw error;
    }
  }

  /**
   * Get image requests by user ID
   * @static
   * @async
   * @param {number} userId - User ID
   * @param {number} [limit=10] - Maximum number of requests to return
   * @param {number} [offset=0] - Offset for pagination
   * @returns {Array} Array of image request objects
   */
  static async getByUserId(userId, limit = 10, offset = 0) {
    try {
      const result = await db.query(
        'SELECT * FROM image_generation_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting image requests by user ID:', error);
      throw error;
    }
  }

  /**
   * Get image request count by user ID
   * @static
   * @async
   * @param {number} userId - User ID
   * @returns {number} Image request count
   */
  static async getCountByUserId(userId) {
    try {
      const result = await db.query(
        'SELECT COUNT(*) FROM image_generation_requests WHERE user_id = $1',
        [userId]
      );
      
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error getting image request count:', error);
      throw error;
    }
  }

  /**
   * Get available renovation themes
   * @static
   * @returns {Array} Renovation themes
   */
  static getRenovationThemes() {
    return [
      { 
        id: 'modern-minimalist', 
        name: 'Modern Minimalist', 
        description: 'Clean lines, geometric patterns, and minimal color palette. Features concrete pavers, structural plants, and zen elements.' 
      },
      { 
        id: 'tropical-paradise', 
        name: 'Tropical Paradise', 
        description: 'Lush vegetation, vibrant colors, and resort-like features. Features palm trees, colorful flora, and water elements.' 
      },
      { 
        id: 'classic-garden', 
        name: 'Classic Garden', 
        description: 'Traditional landscaping with formal structure and timeless elements. Features symmetrical designs, flowering perennials, and decorative hedges.' 
      },
      { 
        id: 'rustic-retreat', 
        name: 'Rustic Retreat', 
        description: 'Natural materials, cottage-style plantings, and cozy gathering spaces. Features stone pathways, wildflowers, and wooden elements.' 
      },
      { 
        id: 'desert-oasis', 
        name: 'Desert Oasis', 
        description: 'Drought-resistant design with sculptural plants and earthy tones. Features succulents, gravel, and architectural accents.' 
      },
      { 
        id: 'urban-terrace', 
        name: 'Urban Terrace', 
        description: 'Space-efficient design with vertical elements and multipurpose features. Features container gardens, living walls, and modular furniture.' 
      }
    ];
  }

  /**
   * Get renovation levels
   * @static
   * @returns {Array} Renovation levels
   */
  static getRenovationLevels() {
    return [
      { 
        id: 'essential', 
        name: 'Essential', 
        description: 'Basic redesign with fundamental improvements. Limited plant varieties and simpler hardscaping. Most affordable option.' 
      },
      { 
        id: 'enhanced', 
        name: 'Enhanced', 
        description: 'Comprehensive redesign with quality materials. Greater plant diversity and more detailed features. Mid-range investment.' 
      },
      { 
        id: 'premium', 
        name: 'Premium', 
        description: 'Luxury transformation with premium materials. Extensive plant selection, custom features, and unique elements. High-end investment.' 
      }
    ];
  }
}

module.exports = ImageRequest; 