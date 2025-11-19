/**
 * Calculate estimated reading time for blog posts
 * @param {string} text - The text content to analyze
 * @returns {number} - Estimated reading time in minutes
 */
export const calculateReadingTime = (text) => {
  if (!text) return 0;
  
  // Average reading speed: 200-250 words per minute
  // Using 225 as a middle ground
  const wordsPerMinute = 225;
  
  // Remove HTML tags and count words
  const cleanText = text.replace(/<[^>]*>/g, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  
  // Calculate reading time and round up
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Minimum 1 minute
  return Math.max(1, readingTime);
};

/**
 * Format reading time for display
 * @param {number} minutes - Reading time in minutes
 * @returns {string} - Formatted string like "5 min read"
 */
export const formatReadingTime = (minutes) => {
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};
