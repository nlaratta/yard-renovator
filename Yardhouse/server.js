/**
 * @fileoverview Main server file for the Yard Renovator application.
 * This file sets up the Express server, middleware, and routes.
 * 
 * @author Yard Renovator Team
 * @version 1.0.0
 */

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

// Import route handlers
const authRoutes = require('./routes/auth');
const creditsRoutes = require('./routes/credits');
const imagesRoutes = require('./routes/images');
const userRoutes = require('./routes/user');
const affiliateRoutes = require('./routes/affiliate');

// Create Express app
const app = express();

// Initialize PostgreSQL connection pool
/**
 * @type {Pool} - PostgreSQL connection pool
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Configure passport
require('./config/passport')(passport);

// Set up middleware
app.use(helmet()); // Set security-related HTTP headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Session configuration
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'sessions' // Use a custom session table name
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// CSRF protection (exclude specific routes if needed)
const csrfProtection = csrf({ cookie: false });
app.use((req, res, next) => {
  // Skip CSRF for specific routes (e.g., webhooks)
  if (req.path === '/api/credits/callback') {
    return next();
  }
  return csrfProtection(req, res, next);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/affiliate', affiliateRoutes);

// Serve CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
/**
 * @function errorHandler
 * @description Global error handler for the application
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle CSRF errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid CSRF token'
    });
  }
  
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;

/**
 * @function startServer
 * @description Starts the Express server
 * @returns {http.Server} - The HTTP server instance
 */
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server; 