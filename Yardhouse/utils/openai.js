/**
 * @fileoverview OpenAI API utility functions
 * Provides functions for interacting with OpenAI's APIs
 * 
 * @module utils/openai
 */

const { Configuration, OpenAIApi } = require('openai');

/**
 * Configuration for OpenAI API
 * @type {Configuration}
 */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI API instance
 * @type {OpenAIApi}
 */
const openai = new OpenAIApi(configuration);

/**
 * Generate a prompt for image creation from user options
 * @async
 * @function generatePrompt
 * @param {Object} options - User selected renovation options
 * @param {string} options.theme - Renovation theme
 * @param {string} options.level - Renovation level
 * @param {string} [options.notes] - Additional notes
 * @returns {string} Generated prompt for image creation
 */
async function generatePrompt(options) {
  try {
    const { theme, level, notes } = options;
    
    // Call ChatGPT API to generate a detailed prompt
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional landscaper and garden designer. Your task is to generate a detailed prompt for DALL-E to create a realistic, beautiful yard renovation image based on the provided theme and renovation level. Focus on growing and building elements that would be purchasable from Amazon. The prompt should be very detailed and focus on realistic renovations.`
        },
        {
          role: "user",
          content: `Create a detailed DALL-E prompt for a yard renovation with the following parameters:
          - Theme: ${theme}
          - Renovation level: ${level}
          ${notes ? `- Additional notes: ${notes}` : ''}
          
          The prompt should focus on realistic, purchasable elements available on Amazon. Be specific about plants, furniture, decorations, and materials. Make sure the renovations show growth and building themes. The final result should be photorealistic.`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}

/**
 * Generate an image using OpenAI's DALL-E
 * @async
 * @function generateImage
 * @param {string} prompt - The prompt for image generation
 * @returns {string} URL of the generated image
 */
async function generateImage(prompt) {
  try {
    // Add modifiers to ensure photorealistic output
    const enhancedPrompt = `${prompt} The image should be photorealistic, high resolution, with natural lighting and realistic colors, showing a yard that could exist in real life.`;
    
    const response = await openai.createImage({
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });
    
    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

/**
 * Generate product suggestions from image
 * @async
 * @function generateProductSuggestions
 * @param {string} imageUrl - URL of the generated image
 * @param {Object} options - User selected renovation options
 * @returns {Array} Array of product suggestion objects
 */
async function generateProductSuggestions(imageUrl, options) {
  try {
    // In a real implementation, you might use image analysis to identify products
    // For now, we'll use the theme and level to suggest relevant products
    
    // This would be replaced with actual logic to analyze the image and options
    return [
      {
        category: 'Plants',
        items: ['Garden roses', 'Ornamental grasses', 'Flowering shrubs']
      },
      {
        category: 'Furniture',
        items: ['Garden bench', 'Outdoor dining set', 'Patio chairs']
      },
      {
        category: 'Decorations',
        items: ['Garden lights', 'Water feature', 'Planters']
      }
    ];
  } catch (error) {
    console.error('Error generating product suggestions:', error);
    throw error;
  }
}

module.exports = {
  generatePrompt,
  generateImage,
  generateProductSuggestions
}; 