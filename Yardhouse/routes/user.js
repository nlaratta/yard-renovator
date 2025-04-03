/**
 * @fileoverview User routes for the Yard Renovator application
 * Handles user profile, history, and settings
 * 
 * @module routes/user
 */

const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const User = require('../models/User');
const ImageRequest = require('../models/ImageRequest');
const { toCamelCase } = require('../utils/formatters');
const { validationResult, body } = require('express-validator');

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', ensureAuth, (req, res) => {
  try {
    // Don't send sensitive information to the client
    const { id, name, email, picture, credit_balance } = req.user;
    
    res.json({
      status: 'success',
      data: {
        id,
        name,
        email,
        picture,
        creditBalance: credit_balance
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving user profile'
    });
  }
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
  ensureAuth,
  body('name').optional().notEmpty().withMessage('Name cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    const { name } = req.body;
    
    // Only allow updating name for now
    const updates = {};
    if (name) updates.name = name;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields to update'
      });
    }
    
    const updatedUser = await User.update(req.user.id, updates);
    
    // Don't send sensitive information to the client
    const { id, name: updatedName, email, picture, credit_balance } = updatedUser;
    
    res.json({
      status: 'success',
      data: {
        id,
        name: updatedName,
        email,
        picture,
        creditBalance: credit_balance
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error updating user profile'
    });
  }
});

/**
 * @route   GET /api/user/history
 * @desc    Get user's image generation history
 * @access  Private
 */
router.get('/history', ensureAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const requests = await ImageRequest.getByUserId(req.user.id, limit, offset);
    const total = await ImageRequest.getCountByUserId(req.user.id);
    
    res.json({
      status: 'success',
      data: {
        requests: toCamelCase(requests),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting user history:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving user history'
    });
  }
});

/**
 * @route   GET /api/user/dashboard
 * @desc    Get user dashboard data including summary stats
 * @access  Private
 */
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    // Get credit balance
    const creditBalance = await User.getCreditBalance(req.user.id);
    
    // Get recent image requests (limit to 5)
    const recentRequests = await ImageRequest.getByUserId(req.user.id, 5, 0);
    
    // Get total count of completed requests
    const completedRequests = await ImageRequest.getCountByUserId(req.user.id);
    
    res.json({
      status: 'success',
      data: {
        user: {
          name: req.user.name,
          picture: req.user.picture,
          creditBalance
        },
        stats: {
          completedRequests,
          // Add more stats as needed
        },
        recentRequests: toCamelCase(recentRequests)
      }
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving dashboard data'
    });
  }
});

module.exports = router; 