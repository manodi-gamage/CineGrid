/**
 * Utility functions for formatting various data types
 * Used throughout the app for consistent formatting
 */

/**
 * Format runtime in minutes to "Xh Ym" format
 * @param {number} minutes - Runtime in minutes
 * @returns {string} Formatted runtime (e.g., "2h 30m")
 */
export const formatRuntime = (minutes) => {
  if (!minutes || minutes === 0) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
};

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string (e.g., "1999-03-30")
 * @returns {string} Formatted date (e.g., "March 30, 1999")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return dateString;
  }
};

/**
 * Extract year from date string
 * @param {string} dateString - ISO date string (e.g., "1999-03-30")
 * @returns {string} Year (e.g., "1999")
 */
export const getYearFromDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch (error) {
    return dateString.split('-')[0] || 'N/A';
  }
};

/**
 * Format money to short format with M/K suffix
 * @param {number} amount - Amount in dollars
 * @returns {string} Formatted money (e.g., "$63.0M", "$1.2K")
 */
export const formatMoney = (amount) => {
  if (!amount || amount === 0) return 'N/A';
  
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  
  return `$${amount}`;
};

/**
 * Format large numbers to readable format with K/M suffix
 * @param {number} number - Number to format
 * @returns {string} Formatted number (e.g., "24.8K", "1.2M")
 */
export const formatNumber = (number) => {
  if (!number || number === 0) return '0';
  
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  
  return number.toString();
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "Keanu Reeves" → "KR")
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
