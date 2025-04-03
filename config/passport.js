/**
 * @fileoverview Passport.js configuration file for authentication strategies
 * 
 * @module config/passport
 */

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Pool } = require('pg');

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Configure Passport authentication strategies
 * @param {Object} passport - Passport.js instance
 */
module.exports = (passport) => {
  /**
   * Google OAuth 2.0 Strategy
   * @type {GoogleStrategy}
   */
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    proxy: true
  }, 
  /**
   * Google OAuth verification callback
   * @async
   * @param {string} accessToken - OAuth access token
   * @param {string} refreshToken - OAuth refresh token
   * @param {Object} profile - User profile from Google
   * @param {Function} done - Passport callback function
   */
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value;
    const picture = photos[0].value;
    
    try {
      // Check if user exists
      const existingUserResult = await pool.query(
        'SELECT * FROM users WHERE google_id = $1',
        [id]
      );
      
      if (existingUserResult.rows.length > 0) {
        // Update existing user
        const updatedUserResult = await pool.query(
          'UPDATE users SET name = $1, picture = $2, updated_at = NOW() WHERE google_id = $3 RETURNING *',
          [displayName, picture, id]
        );
        
        return done(null, updatedUserResult.rows[0]);
      } else {
        // Create new user
        const newUserResult = await pool.query(
          'INSERT INTO users (google_id, email, name, picture, credit_balance, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
          [id, email, displayName, picture, 0]
        );
        
        return done(null, newUserResult.rows[0]);
      }
    } catch (err) {
      console.error('Error in Google OAuth Strategy:', err);
      return done(err, null);
    }
  }));
  
  /**
   * Serialize user to store in the session
   * @param {Object} user - User object
   * @param {Function} done - Passport callback function
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  /**
   * Deserialize user from the session
   * @param {string} id - User ID
   * @param {Function} done - Passport callback function
   */
  passport.deserializeUser(async (id, done) => {
    try {
      const userResult = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      
      if (userResult.rows.length === 0) {
        return done(null, false);
      }
      
      done(null, userResult.rows[0]);
    } catch (err) {
      done(err, null);
    }
  });
}; 