/**
 * Image Helper Utilities
 * 
 * This module provides helper functions to construct full image URLs from TMDB image paths.
 * Handles different image types (poster, backdrop, profile) and provides fallback for missing images.
 * 
 * Documentation: https://developer.themoviedb.org/docs/image-basics
 */

import tmdbConfig from '../config/tmdbConfig';

/**
 * Placeholder images for missing content
 */
const PLACEHOLDERS = {
  poster: 'https://via.placeholder.com/500x750/2C3E50/ECF0F1?text=No+Poster',
  backdrop: 'https://via.placeholder.com/1280x720/2C3E50/ECF0F1?text=No+Backdrop',
  profile: 'https://via.placeholder.com/185x278/2C3E50/ECF0F1?text=No+Image',
  logo: 'https://via.placeholder.com/185x185/2C3E50/ECF0F1?text=No+Logo',
};

/**
 * Get full image URL from TMDB image path
 * @param {string|null} path - TMDB image path (e.g., "/abc123.jpg")
 * @param {string} size - Image size (e.g., "w500", "original")
 * @param {string} type - Image type for placeholder (poster, backdrop, profile, logo)
 * @returns {string} Full image URL or placeholder
 */
export const getImageUrl = (path, size = 'w500', type = 'poster') => {
  if (!path || path === null) {
    return PLACEHOLDERS[type] || PLACEHOLDERS.poster;
  }

  return `${tmdbConfig.imageBaseUrl}${size}${path}`;
};

/**
 * Get poster image URL
 * @param {string|null} path - TMDB poster path
 * @param {string} size - Poster size (default: w500)
 * @returns {string} Full poster URL or placeholder
 * 
 * Available sizes: w92, w154, w185, w342, w500, w780, original
 */
export const getPosterUrl = (path, size = null) => {
  const posterSize = size || tmdbConfig.defaultSizes.poster;
  return getImageUrl(path, posterSize, 'poster');
};

/**
 * Get backdrop image URL
 * @param {string|null} path - TMDB backdrop path
 * @param {string} size - Backdrop size (default: original)
 * @returns {string} Full backdrop URL or placeholder
 * 
 * Available sizes: w300, w780, w1280, original
 */
export const getBackdropUrl = (path, size = null) => {
  const backdropSize = size || tmdbConfig.defaultSizes.backdrop;
  return getImageUrl(path, backdropSize, 'backdrop');
};

/**
 * Get profile image URL (for cast/crew)
 * @param {string|null} path - TMDB profile path
 * @param {string} size - Profile size (default: w185)
 * @returns {string} Full profile URL or placeholder
 * 
 * Available sizes: w45, w185, h632, original
 */
export const getProfileUrl = (path, size = null) => {
  const profileSize = size || tmdbConfig.defaultSizes.profile;
  return getImageUrl(path, profileSize, 'profile');
};

/**
 * Get logo image URL
 * @param {string|null} path - TMDB logo path
 * @param {string} size - Logo size (default: w185)
 * @returns {string} Full logo URL or placeholder
 * 
 * Available sizes: w45, w92, w154, w185, w300, w500, original
 */
export const getLogoUrl = (path, size = null) => {
  const logoSize = size || tmdbConfig.defaultSizes.logo;
  return getImageUrl(path, logoSize, 'logo');
};

/**
 * Get multiple poster URLs with different sizes
 * Useful for responsive images or srcSet
 * @param {string|null} path - TMDB poster path
 * @returns {Object} Object with different poster sizes
 */
export const getResponsivePosterUrls = (path) => {
  if (!path) {
    return {
      small: PLACEHOLDERS.poster,
      medium: PLACEHOLDERS.poster,
      large: PLACEHOLDERS.poster,
      xlarge: PLACEHOLDERS.poster,
      original: PLACEHOLDERS.poster,
    };
  }

  return {
    small: getPosterUrl(path, 'w185'),
    medium: getPosterUrl(path, 'w342'),
    large: getPosterUrl(path, 'w500'),
    xlarge: getPosterUrl(path, 'w780'),
    original: getPosterUrl(path, 'original'),
  };
};

/**
 * Get multiple backdrop URLs with different sizes
 * Useful for responsive images or srcSet
 * @param {string|null} path - TMDB backdrop path
 * @returns {Object} Object with different backdrop sizes
 */
export const getResponsiveBackdropUrls = (path) => {
  if (!path) {
    return {
      small: PLACEHOLDERS.backdrop,
      medium: PLACEHOLDERS.backdrop,
      large: PLACEHOLDERS.backdrop,
      original: PLACEHOLDERS.backdrop,
    };
  }

  return {
    small: getBackdropUrl(path, 'w300'),
    medium: getBackdropUrl(path, 'w780'),
    large: getBackdropUrl(path, 'w1280'),
    original: getBackdropUrl(path, 'original'),
  };
};

/**
 * Check if image path is valid
 * @param {string|null} path - TMDB image path
 * @returns {boolean} True if path is valid
 */
export const isValidImagePath = (path) => {
  return path !== null && path !== undefined && path !== '';
};

/**
 * Get YouTube thumbnail from video key
 * @param {string} videoKey - YouTube video key
 * @param {string} quality - Thumbnail quality (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns {string} YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (videoKey, quality = 'hqdefault') => {
  if (!videoKey) {
    return PLACEHOLDERS.backdrop;
  }
  return `https://img.youtube.com/vi/${videoKey}/${quality}.jpg`;
};

/**
 * Get YouTube video URL
 * @param {string} videoKey - YouTube video key
 * @returns {string} YouTube video URL
 */
export const getYouTubeUrl = (videoKey) => {
  if (!videoKey) {
    return null;
  }
  return `https://www.youtube.com/watch?v=${videoKey}`;
};

/**
 * Extract video key from TMDB videos response
 * Finds the first official trailer or teaser
 * @param {Array} videos - Array of video objects from TMDB
 * @returns {string|null} Video key or null
 */
export const getTrailerKey = (videos) => {
  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    return null;
  }

  // Try to find official trailer first
  const trailer = videos.find(
    (video) =>
      video.site === 'YouTube' &&
      video.type === 'Trailer' &&
      video.official === true
  );

  if (trailer) {
    return trailer.key;
  }

  // Fall back to any trailer
  const anyTrailer = videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  if (anyTrailer) {
    return anyTrailer.key;
  }

  // Fall back to teaser
  const teaser = videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Teaser'
  );

  return teaser ? teaser.key : null;
};

/**
 * Format movie release year from date string
 * @param {string} dateString - Release date (YYYY-MM-DD)
 * @returns {string} Release year or 'N/A'
 */
export const getReleaseYear = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }
  return dateString.split('-')[0];
};

/**
 * Format movie runtime to hours and minutes
 * @param {number} minutes - Runtime in minutes
 * @returns {string} Formatted runtime (e.g., "2h 30m")
 */
export const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) {
    return 'N/A';
  }

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
 * Format vote average to one decimal place
 * @param {number} voteAverage - Vote average (0-10)
 * @returns {string} Formatted vote average
 */
export const formatVoteAverage = (voteAverage) => {
  if (!voteAverage || voteAverage === 0) {
    return 'N/A';
  }
  return voteAverage.toFixed(1);
};

/**
 * Format large numbers (e.g., budget, revenue)
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "$123.4M")
 */
export const formatCurrency = (num) => {
  if (!num || num === 0) {
    return 'N/A';
  }

  const billion = 1000000000;
  const million = 1000000;

  if (num >= billion) {
    return `$${(num / billion).toFixed(1)}B`;
  }

  if (num >= million) {
    return `$${(num / million).toFixed(1)}M`;
  }

  return `$${num.toLocaleString()}`;
};

/**
 * Default export with all helper functions
 */
const imageHelper = {
  getImageUrl,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  getLogoUrl,
  getResponsivePosterUrls,
  getResponsiveBackdropUrls,
  isValidImagePath,
  getYouTubeThumbnail,
  getYouTubeUrl,
  getTrailerKey,
  getReleaseYear,
  formatRuntime,
  formatVoteAverage,
  formatCurrency,
  PLACEHOLDERS,
};

export default imageHelper;
