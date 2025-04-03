/**
 * @fileoverview Utility functions for formatting data
 * 
 * @module utils/formatters
 */

/**
 * Convert snake_case keys to camelCase
 * @function toCamelCase
 * @param {Object} obj - Object with snake_case keys
 * @returns {Object} Object with camelCase keys
 */
const toCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Convert nested objects recursively
    acc[camelKey] = toCamelCase(obj[key]);
    
    return acc;
  }, {});
};

/**
 * Convert camelCase keys to snake_case
 * @function toSnakeCase
 * @param {Object} obj - Object with camelCase keys
 * @returns {Object} Object with snake_case keys
 */
const toSnakeCase = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`);
    
    // Convert nested objects recursively
    acc[snakeKey] = toSnakeCase(obj[key]);
    
    return acc;
  }, {});
};

module.exports = {
  toCamelCase,
  toSnakeCase
}; 