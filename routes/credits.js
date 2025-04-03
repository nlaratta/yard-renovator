/**
 * @fileoverview Credit management routes for the Yard Renovator application
 * Handles credit balance, purchases, and transactions
 * 
 * @module routes/credits
 */

const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { toCamelCase } = require('../utils/formatters');
const { validationResult, body } = require('express-validator');

// Mock PayPal service (would be replaced with actual SDK in production)
const paypal = {
  createPayment: async (amount, description) => {
    console.log(`Creating PayPal payment for $${amount}: ${description}`);
    
    // In production, this would call the PayPal API
    // For demo, return a mock PayPal URL
    const paymentId = `PAY-${Date.now()}`;
    
    return {
      id: paymentId,
      links: [
        {
          rel: 'approval_url',
          href: `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${paymentId}`
        }
      ]
    };
  },
  
  executePayment: async (paymentId, payerId) => {
    console.log(`Executing PayPal payment ${paymentId} for payer ${payerId}`);
    
    // In production, this would call the PayPal API
    // For demo, return success
    return {
      id: paymentId,
      state: 'approved'
    };
  }
};

/**
 * @route   GET /api/credits/balance
 * @desc    Get user's credit balance
 * @access  Private
 */
router.get('/balance', ensureAuth, async (req, res) => {
  try {
    const creditBalance = await User.getCreditBalance(req.user.id);
    
    res.json({
      status: 'success',
      data: {
        creditBalance
      }
    });
  } catch (error) {
    console.error('Error getting credit balance:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving credit balance'
    });
  }
});

/**
 * @route   POST /api/credits/purchase
 * @desc    Create a PayPal payment for credits
 * @access  Private
 */
router.post('/purchase', [
  ensureAuth,
  body('packageId').notEmpty().withMessage('Package ID is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  
  try {
    const { packageId } = req.body;
    
    // Get package details
    const creditPackage = Transaction.getCreditPackageById(packageId);
    
    if (!creditPackage) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid package ID'
      });
    }
    
    // Create PayPal payment
    const payment = await paypal.createPayment(
      creditPackage.amount,
      `Purchase of ${creditPackage.credits} credits`
    );
    
    // Store transaction with pending status
    await Transaction.create({
      userId: req.user.id,
      amount: creditPackage.amount,
      creditsAmount: creditPackage.credits,
      provider: 'PayPal',
      paymentId: payment.id,
      status: 'pending'
    });
    
    // Get approval URL
    const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
    
    res.json({
      status: 'success',
      data: {
        approvalUrl,
        paymentId: payment.id
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error processing payment request'
    });
  }
});

/**
 * @route   GET /api/credits/callback
 * @desc    Handle PayPal payment callback
 * @access  Public (but verifies with PayPal)
 */
router.get('/callback', async (req, res) => {
  try {
    const { paymentId, PayerID } = req.query;
    
    if (!paymentId || !PayerID) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing payment parameters'
      });
    }
    
    // Get transaction
    const transaction = await Transaction.getById(paymentId);
    
    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    
    // Execute payment with PayPal
    const paymentResult = await paypal.executePayment(paymentId, PayerID);
    
    if (paymentResult.state !== 'approved') {
      await Transaction.updateStatus(paymentId, 'failed');
      
      return res.redirect(process.env.NODE_ENV === 'production'
        ? `${process.env.CLIENT_URL}/payment-failed`
        : 'http://localhost:3000/payment-failed');
    }
    
    // Update transaction status
    await Transaction.updateStatus(paymentId, 'completed');
    
    // Add credits to user's balance
    await User.updateCreditBalance(transaction.user_id, transaction.credits_purchased);
    
    // Redirect to success page
    res.redirect(process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/payment-success`
      : 'http://localhost:3000/payment-success');
  } catch (error) {
    console.error('Error processing payment callback:', error);
    
    res.redirect(process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/payment-failed`
      : 'http://localhost:3000/payment-failed');
  }
});

/**
 * @route   GET /api/credits/transactions
 * @desc    Get user's transaction history
 * @access  Private
 */
router.get('/transactions', ensureAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { transactions, total } = await Transaction.getByUserId(req.user.id, limit, offset);
    
    res.json({
      status: 'success',
      data: {
        transactions: toCamelCase(transactions),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving transaction history'
    });
  }
});

/**
 * @route   GET /api/credits/packages
 * @desc    Get available credit packages
 * @access  Public
 */
router.get('/packages', (req, res) => {
  try {
    const creditPackages = Transaction.getCreditPackages();
    
    res.json({
      status: 'success',
      data: {
        packages: creditPackages
      }
    });
  } catch (error) {
    console.error('Error getting credit packages:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving credit packages'
    });
  }
});

module.exports = router; 