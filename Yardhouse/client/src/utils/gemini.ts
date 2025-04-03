/**
 * @fileoverview Utility functions for Gemini-generated images
 */

/**
 * Converts a base64 data URL into a File object that can be uploaded
 * @param {string} dataUrl - The data URL (e.g. data:image/jpeg;base64,...)
 * @param {string} filename - The filename to use
 * @returns {File} File object created from the data URL
 */
export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Check if a URL is a data URL (base64-encoded image)
 * @param {string} url - The URL to check
 * @returns {boolean} True if the URL is a data URL
 */
export const isDataUrl = (url: string): boolean => {
  return url.startsWith('data:image');
};

/**
 * Safely creates an object URL for an image, works with both regular URLs and data URLs
 * @param {string} imageUrl - The image URL (regular URL or data URL)
 * @returns {string} An object URL that can be used in an <img> tag
 */
export const createImageUrl = (imageUrl: string): string => {
  if (isDataUrl(imageUrl)) {
    return imageUrl; // Data URLs can be used directly
  }
  
  // For regular URLs, just return as is
  return imageUrl;
}; 