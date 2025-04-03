/**
 * @fileoverview AffiliateProduct model for the Yard Renovator application
 * Handles database operations related to Amazon affiliate products
 * 
 * @module models/AffiliateProduct
 */

const db = require('../utils/db');
const axios = require('axios');

/**
 * AffiliateProduct model class
 * @class AffiliateProduct
 */
class AffiliateProduct {
  /**
   * Get a product from cache or fetch it from Amazon
   * @static
   * @async
   * @param {string} productId - Amazon product ID
   * @returns {Object} Product data with affiliate link
   */
  static async getProduct(productId) {
    try {
      // Try to get from cache first
      const cachedProduct = await this.getFromCache(productId);
      
      if (cachedProduct) {
        // Check if cache is still valid (less than 24 hours old)
        const cacheTime = new Date(cachedProduct.last_updated).getTime();
        const now = new Date().getTime();
        const cacheAge = (now - cacheTime) / (1000 * 60 * 60); // in hours
        
        if (cacheAge < 24) {
          return {
            productId: cachedProduct.product_id,
            affiliateLink: cachedProduct.affiliate_link,
            productData: cachedProduct.product_data
          };
        }
      }
      
      // If not in cache or cache is old, fetch from Amazon
      const productData = await this.fetchFromAmazon(productId);
      
      // Cache the result
      await this.cacheProduct(productData);
      
      return productData;
    } catch (error) {
      console.error('Error getting affiliate product:', error);
      throw error;
    }
  }

  /**
   * Get a product from the cache
   * @static
   * @async
   * @param {string} productId - Amazon product ID
   * @returns {Object|null} Cached product or null if not found
   */
  static async getFromCache(productId) {
    try {
      const result = await db.query(
        'SELECT * FROM affiliate_cache WHERE product_id = $1',
        [productId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting product from cache:', error);
      throw error;
    }
  }

  /**
   * Cache a product
   * @static
   * @async
   * @param {Object} product - Product data
   * @param {string} product.productId - Amazon product ID
   * @param {string} product.affiliateLink - Affiliate link
   * @param {Object} product.productData - Product data
   * @returns {Object} Cached product
   */
  static async cacheProduct({ productId, affiliateLink, productData }) {
    try {
      const result = await db.cacheAffiliateProduct({ productId, affiliateLink, productData });
      return result.rows[0];
    } catch (error) {
      console.error('Error caching product:', error);
      throw error;
    }
  }

  /**
   * Fetch product data from Amazon API
   * @static
   * @async
   * @param {string} productId - Amazon product ID
   * @returns {Object} Product data with affiliate link
   */
  static async fetchFromAmazon(productId) {
    try {
      // This is a placeholder for the actual Amazon API call
      // In a real implementation, use Amazon's Product Advertising API
      
      // For demo purposes, return mock data
      // In production, replace with actual API call
      console.log(`Fetching product data for ${productId} from Amazon API`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const productData = {
        productId,
        title: `Garden Product ${productId}`,
        description: 'A beautiful product for your garden renovation',
        price: '$29.99',
        imageUrl: `https://example.com/images/${productId}.jpg`,
        rating: 4.5,
        reviewCount: 120
      };
      
      const affiliateLink = `https://amazon.com/dp/${productId}?tag=${process.env.AMAZON_AFFILIATE_ID}`;
      
      return {
        productId,
        affiliateLink,
        productData
      };
    } catch (error) {
      console.error('Error fetching product from Amazon:', error);
      throw error;
    }
  }

  /**
   * Search for products by category
   * @static
   * @async
   * @param {string} category - Product category
   * @param {Object} [options] - Search options
   * @param {number} [options.limit=10] - Maximum number of products to return
   * @returns {Array} Array of products
   */
  static async searchByCategory(category, options = {}) {
    try {
      const limit = options.limit || 10;
      
      // This is a placeholder for the actual Amazon API search
      // In a real implementation, use Amazon's Product Advertising API
      
      // For demo purposes, return mock data
      // In production, replace with actual API call
      console.log(`Searching Amazon products in category: ${category}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - generate array of products
      const products = Array.from({ length: limit }, (_, i) => {
        const productId = `B0${i}123456${i}`;
        const rating = parseFloat((3.5 + Math.random()).toFixed(1));
        const reviewCount = Math.floor(50 + Math.random() * 200);
        
        return {
          productId,
          affiliateLink: `https://amazon.com/dp/${productId}?tag=${process.env.AMAZON_AFFILIATE_ID || 'demo-tag'}`,
          productData: {
            title: `${category} Product ${i + 1}`,
            description: `A quality ${category} product for your garden renovation`,
            price: `$${(19.99 + i * 5).toFixed(2)}`,
            imageUrl: `https://example.com/images/${productId}.jpg`,
            rating: rating,
            reviewCount: reviewCount
          }
        };
      });
      
      // Cache all products
      for (const product of products) {
        await this.cacheProduct(product);
      }
      
      return products;
    } catch (error) {
      console.error('Error searching products by category:', error);
      throw error;
    }
  }

  /**
   * Get product suggestions for image
   * @static
   * @async
   * @param {Object} renovationOptions - Renovation options used for the image
   * @returns {Array} Array of suggested products
   */
  static async getSuggestionsForImage(renovationOptions) {
    try {
      // Based on renovation options, determine appropriate product categories
      const theme = renovationOptions.theme || 'current';
      const level = renovationOptions.level || 'slight';
      
      let categories = ['garden'];
      
      // Add categories based on theme
      switch (theme) {
        case 'modern':
          categories.push('modern garden', 'outdoor furniture');
          break;
        case 'cottage':
          categories.push('wildflowers', 'garden path');
          break;
        case 'zen':
          categories.push('zen garden', 'meditation');
          break;
        case 'tropical':
          categories.push('tropical plants', 'outdoor lighting');
          break;
        case 'desert':
          categories.push('succulent', 'drought resistant');
          break;
        default:
          categories.push('garden improvement');
      }
      
      // Adjust number of products based on renovation level
      let productCount = 3;
      if (level === 'full') {
        productCount = 5;
      } else if (level === 'fix') {
        productCount = 2;
      }
      
      // Select a random category and get products
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      return await this.searchByCategory(randomCategory, { limit: productCount });
    } catch (error) {
      console.error('Error getting suggestions for image:', error);
      throw error;
    }
  }
}

module.exports = AffiliateProduct; 