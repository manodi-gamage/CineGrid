/**
 * TMDB API Configuration
 * 
 * This file contains all configuration constants for The Movie Database (TMDB) API.
 * Documentation: https://developer.themoviedb.org/reference/intro/getting-started
 */

import { TMDB_API_KEY } from '@env';

/**
 * TMDB API Configuration Object
 */
const tmdbConfig = {
  // API Key from environment variables
  apiKey: TMDB_API_KEY,

  // Base URL for TMDB API v3
  baseUrl: 'https://api.themoviedb.org/3',

  // Base URL for TMDB images
  imageBaseUrl: 'https://image.tmdb.org/t/p/',

  // API version
  apiVersion: 'v3',

  // Default language for API requests
  defaultLanguage: 'en-US',

  // Default region for regional content
  defaultRegion: 'US',

  // Image sizes available from TMDB
  imageSizes: {
    poster: {
      small: 'w92',
      medium: 'w154',
      large: 'w185',
      xlarge: 'w342',
      xxlarge: 'w500',
      xxxlarge: 'w780',
      original: 'original',
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original',
    },
    profile: {
      small: 'w45',
      medium: 'w185',
      large: 'h632',
      original: 'original',
    },
    logo: {
      small: 'w45',
      medium: 'w92',
      large: 'w154',
      xlarge: 'w185',
      xxlarge: 'w300',
      xxxlarge: 'w500',
      original: 'original',
    },
  },

  // Default image sizes for different types
  defaultSizes: {
    poster: 'w500',
    backdrop: 'original',
    profile: 'w185',
    logo: 'w185',
  },

  // Rate limiting (TMDB allows 40 requests per 10 seconds)
  rateLimit: {
    maxRequests: 40,
    perSeconds: 10,
  },

  // Timeout for API requests (in milliseconds)
  timeout: 10000,

  // Endpoints
  endpoints: {
    trending: '/trending/movie',
    popular: '/movie/popular',
    topRated: '/movie/top_rated',
    upcoming: '/movie/upcoming',
    nowPlaying: '/movie/now_playing',
    movieDetails: '/movie',
    search: '/search/movie',
    configuration: '/configuration',
  },
};

/**
 * Validate that API key is configured
 */
export const validateConfig = () => {
  if (!tmdbConfig.apiKey) {
    console.error('TMDB API Key is not configured. Please add TMDB_API_KEY to your .env file.');
    return false;
  }
  return true;
};

/**
 * Get full API URL with endpoint
 * @param {string} endpoint - API endpoint
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${tmdbConfig.baseUrl}${endpoint}`;
};

/**
 * Get image URL with size
 * @param {string} size - Image size
 * @returns {string} Full image base URL with size
 */
export const getImageBaseUrl = (size) => {
  return `${tmdbConfig.imageBaseUrl}${size}`;
};

export default tmdbConfig;
