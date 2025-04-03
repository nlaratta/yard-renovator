/**
 * @fileoverview Affiliate product routes for the Yard Renovator application
 * Handles Amazon affiliate product retrieval and caching
 * 
 * @module routes/affiliate
 */

const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const AffiliateProduct = require('../models/AffiliateProduct');

/**
 * @route   GET /api/affiliate/products/:productId
 * @desc    Get a specific product by ID
 * @access  Private
 */
router.get('/products/:productId', ensureAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await AffiliateProduct.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Error getting product:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving product information'
    });
  }
});

/**
 * @route   GET /api/affiliate/products
 * @desc    Search products by category
 * @access  Private
 */
router.get('/products', ensureAuth, async (req, res) => {
  try {
    const { category, limit } = req.query;
    
    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: 'Category is required'
      });
    }
    
    const options = {};
    if (limit) options.limit = parseInt(limit);
    
    const products = await AffiliateProduct.searchByCategory(category, options);
    
    res.json({
      status: 'success',
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error searching products'
    });
  }
});

/**
 * @route   GET /api/affiliate/suggestions
 * @desc    Get product suggestions for image
 * @access  Private
 */
router.get('/suggestions', ensureAuth, async (req, res) => {
  try {
    const { requestId } = req.query;
    
    if (!requestId) {
      return res.status(400).json({
        status: 'error',
        message: 'Request ID is required'
      });
    }
    
    // In a real implementation, this would fetch the request and get suggestions
    // For demo, we'll use mock data
    const renovationOptions = {
      theme: 'modern',
      level: 'full'
    };
    
    const suggestions = await AffiliateProduct.getSuggestionsForImage(renovationOptions);
    
    res.json({
      status: 'success',
      data: {
        suggestions
      }
    });
  } catch (error) {
    console.error('Error getting product suggestions:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving product suggestions'
    });
  }
});

module.exports = router; 