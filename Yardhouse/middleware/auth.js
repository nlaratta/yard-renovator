/**
 * @fileoverview Authentication middleware for the Yard Renovator application
 * 
 * @module middleware/auth
 */

/**
 * Middleware to check if user is authenticated
 * @function ensureAuth
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({
    status: 'error',
    message: 'Unauthorized - Please log in'
  });
};

/**
 * Middleware to check if user is NOT authenticated
 * @function ensureGuest
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  res.status(400).json({
    status: 'error',
    message: 'You are already logged in'
  });
};

/**
 * Middleware to check if user has sufficient credits
 * @function ensureSufficientCredits
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
const ensureSufficientCredits = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized - Please log in'
    });
  }
  
  if (req.user.credit_balance < 1) {
    return res.status(403).json({
      status: 'error',
      message: 'Insufficient credits - Please purchase more credits'
    });
  }
  
  next();
};

module.exports = {
  ensureAuth,
  ensureGuest,
  ensureSufficientCredits
}; 