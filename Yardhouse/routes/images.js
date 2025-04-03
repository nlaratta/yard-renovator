/**
 * @fileoverview Image generation routes for the Yard Renovator application
 * Handles image upload, processing, and retrieval
 * 
 * @module routes/images
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const { ensureAuth, ensureSufficientCredits } = require('../middleware/auth');
const User = require('../models/User');
const ImageRequest = require('../models/ImageRequest');
const AffiliateProduct = require('../models/AffiliateProduct');
const openai = require('../utils/openai');
const gemini = require('../utils/gemini');
const { toCamelCase, toSnakeCase } = require('../utils/formatters');
const { validationResult, body } = require('express-validator');

// Configure AWS S3 (in production, this would be set up with proper credentials)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Upload file to S3 (in production)
 * @async
 * @function uploadToS3
 * @param {string} filePath - Local file path
 * @param {string} fileName - File name to use in S3
 * @returns {string} S3 file URL
 */
async function uploadToS3(filePath, fileName) {
  if (process.env.NODE_ENV !== 'production') {
    // In development, just return the local path
    return `/uploads/${path.basename(filePath)}`;
  }
  
  // In production, upload to S3
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${fileName}`,
    Body: fileContent,
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };
  
  const data = await s3.upload(params).promise();
  
  // Delete local file after upload
  fs.unlinkSync(filePath);
  
  return data.Location;
}

/**
 * @route   POST /api/images/upload
 * @desc    Upload image and create renovation request
 * @access  Private
 */
router.post('/upload', [
  ensureAuth,
  ensureSufficientCredits,
  upload.single('image'),
  body('theme').notEmpty().withMessage('Theme is required'),
  body('level').notEmpty().withMessage('Renovation level is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }
    
    // Get renovation options from request
    const { theme, level, notes } = req.body;
    
    // Store options for processing
    const renovationOptions = {
      theme,
      level,
      notes: notes || ''
    };
    
    // Create image generation request in database with the uploaded image path
    const imageRequest = await ImageRequest.create({
      userId: req.user.id,
      renovationOptions,
      originalImagePath: req.file.path // Store the path to the uploaded image
    });
    
    // Deduct credit from user
    await User.updateCreditBalance(req.user.id, -1);
    
    // Process request in background to avoid timeout
    // In production, this would be done with a queue
    setTimeout(async () => {
      try {
        // Read the uploaded image file
        console.log('Reading image file...');
        const imageBuffer = fs.readFileSync(req.file.path);
        
        // 1. Generate prompt from options using OpenAI
        console.log('Generating prompt...');
        const prompt = "You are a professional landscaper, outdoor designer, and garden designer. Edit this image with these options, improving the landscaping, rearranging, and adding new elements. Do not remove fences, houses, permanent structures, cars, concrete foundation, existing paths, existing large rocks or rock beds, or large trees. Do not add new fences, houses, large structures, cars, large mature trees, or concrete foundation. Do not change the materials of existing manmade structures. If a yard is overgrown, remove the excess plants, bushes, trees, etc. If there is clutter that doesn't appear to be meant for the yard, remove it. Theme: " + renovationOptions.theme + ' ' + "Renovation Level: " + renovationOptions.level + ' ' + "Notes: " + renovationOptions.notes;
        
        // 2. Generate image using Gemini API with the uploaded image and generated prompt
        console.log('Generating image...');
        console.log(prompt);
        const imageUrl = await gemini.generateImage(prompt, imageBuffer);
         
        // 3. Get affiliate product suggestions
        console.log('Getting product suggestions...');
        const productSuggestions = await AffiliateProduct.getSuggestionsForImage(renovationOptions);
        
        // Ensure productSuggestions is properly formatted for JSON storage
        const cleanedSuggestions = productSuggestions.map(suggestion => {
          const cleanData = { ...suggestion };
          
          if (cleanData.productData) {
            if (typeof cleanData.productData.rating === 'string') {
              cleanData.productData.rating = parseFloat(cleanData.productData.rating);
            }
            if (typeof cleanData.productData.reviewCount === 'string') {
              cleanData.productData.reviewCount = parseInt(cleanData.productData.reviewCount, 10);
            }
          }
          
          return cleanData;
        });
        
        // 4. Update request status with image URL and affiliate links
        console.log('Updating request status...');
        await ImageRequest.update(imageRequest.request_id, {
          status: 'completed',
          generatedImageUrl: imageUrl,
          affiliateLinks: cleanedSuggestions
        });
        
        // 5. Clean up the uploaded file
        console.log('Cleaning up uploaded file...');
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (error) {
        console.error('Error processing image request:', error);
        
        await ImageRequest.update(imageRequest.request_id, {
          status: 'failed'
        });
        
        // Clean up the uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }, 0);
    
    // Return the request ID and estimated processing time
    res.json({
      status: 'success',
      data: {
        requestId: imageRequest.request_id,
        estimatedTime: '30-60 seconds'
      }
    });
  } catch (error) {
    console.error('Error creating image request:', error);
    
    // Delete uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error processing your request'
    });
  }
});

/**
 * @route   GET /api/images/themes
 * @desc    Get available renovation themes
 * @access  Public
 */
router.get('/themes', (req, res) => {
  try {
    const themes = ImageRequest.getRenovationThemes();
    
    res.json({
      status: 'success',
      data: {
        themes
      }
    });
  } catch (error) {
    console.error('Error getting renovation themes:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving renovation themes'
    });
  }
});

/**
 * @route   GET /api/images/levels
 * @desc    Get available renovation levels
 * @access  Public
 */
router.get('/levels', (req, res) => {
  try {
    const levels = ImageRequest.getRenovationLevels();
    
    res.json({
      status: 'success',
      data: {
        levels
      }
    });
  } catch (error) {
    console.error('Error getting renovation levels:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving renovation levels'
    });
  }
});

/**
 * @route   GET /api/images/:requestId
 * @desc    Get image generation request status and result
 * @access  Private
 */
router.get('/:requestId', ensureAuth, async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Ensure requestId is a number
    if (isNaN(parseInt(requestId))) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request ID format'
      });
    }
    
    const imageRequest = await ImageRequest.getById(requestId);
    
    if (!imageRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }
    
    // Check if user owns this request
    if (imageRequest.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this request'
      });
    }
    
    // Convert snake_case to camelCase for frontend consistency
    res.json({
      status: 'success',
      data: toCamelCase(imageRequest)
    });
  } catch (error) {
    console.error('Error getting image request:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving request information'
    });
  }
});

module.exports = router; 