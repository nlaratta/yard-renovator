/**
 * @fileoverview Gemini API utility functions
 * Provides functions for interacting with Google's Gemini API for image generation
 * 
 * @module utils/gemini
 */

const { GoogleGenAI } = require('@google/genai');

/**
 * Gemini API instance
 * @type {GoogleGenAI}
 */
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate an image using Gemini API
 * @async
 * @function generateImage
 * @param {string} prompt - The prompt for image generation
 * @param {Buffer} imageBuffer - The buffer of the input image
 * @returns {string} URL of the generated image
 */
async function generateImage(prompt, imageBuffer) {
  try {
    // Get the mime type from the image buffer
    const mimeType = 'image/jpeg'; // In a real implementation, you'd detect this

    // Create parts array with the prompt text and image
    const contents = [
      { text: prompt },
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType,
        },
      },
    ];

    // Use the correct content structure for this version of the Node.js client
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });
    
    // Process response to extract image
    const responseParts = result.candidates[0].content.parts;
    
    // Find the image part in the response
    const imagePart = responseParts.find(part => part.inlineData);
    
    if (!imagePart) {
      throw new Error('No image was generated in the response');
    }
    
    // Create a data URL from the image data
    const imageData = imagePart.inlineData.data;
    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imageData}`;
    
    return imageUrl;
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    throw error;
  }
}

/**
 * Create a full URL for an image
 * @function createImageUrl
 * @param {string} path - The image path or data URL
 * @returns {string} Complete image URL
 */
function createImageUrl(path) {
  // If it's already a data URL, return it as is
  if (path && path.startsWith('data:')) {
    return path;
  }
  
  // Handle relative paths or other URLs
  // In production, this would point to your CDN or S3 bucket
  return path;
}

module.exports = {
  generateImage,
  createImageUrl
}; 