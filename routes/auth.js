/**
 * @fileoverview Authentication routes for the Yard Renovator application
 * Handles user authentication via Google OAuth
 * 
 * @module routes/auth
 */

const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   GET /api/auth/google
 * @desc    Authenticate with Google
 * @access  Public
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google auth callback
 * @access  Public
 */
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: process.env.NODE_ENV === 'production' 
      ? `${process.env.CLIENT_URL}/login?error=true` 
      : 'http://localhost:3000/login?error=true'
  }),
  (req, res) => {
    // Successful authentication, redirect to home page
    res.redirect(process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL 
      : 'http://localhost:3000');
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Not authenticated' 
    });
  }
  
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
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error logging out' 
      });
    }
    
    res.json({ 
      status: 'success', 
      message: 'Logged out successfully'
    });
  });
});

module.exports = router; 