/**
 * TMDB API Service
 * 
 * This service handles all API requests to The Movie Database (TMDB).
 * It includes axios configuration, interceptors, error handling, and all movie-related endpoints.
 * 
 * Rate Limit: 40 requests per 10 seconds
 * Documentation: https://developer.themoviedb.org/reference/intro/getting-started
 */

import axios from 'axios';
import tmdbConfig, { validateConfig } from '../config/tmdbConfig';

// Validate configuration on service initialization
validateConfig();

/**
 * Create axios instance with TMDB configuration
 */
const tmdbApi = axios.create({
  baseURL: tmdbConfig.baseUrl,
  timeout: tmdbConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds API key and default parameters to all requests
 */
tmdbApi.interceptors.request.use(
  (config) => {
    // Add API key to all requests
    config.params = {
      ...config.params,
      api_key: tmdbConfig.apiKey,
      language: config.params?.language || tmdbConfig.defaultLanguage,
    };

    // Log request in development
    if (__DEV__) {
      console.log('TMDB API Request:', config.method.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles response transformation and error handling
 */
tmdbApi.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('TMDB API Response:', response.config.url, 'Status:', response.status);
    }
    return response.data;
  },
  (error) => {
    // Handle different error types
    const errorMessage = handleApiError(error);
    
    if (__DEV__) {
      console.error('TMDB API Error:', errorMessage);
    }

    return Promise.reject(errorMessage);
  }
);

/**
 * Error Handler
 * Provides user-friendly error messages based on error type
 * @param {Error} error - Axios error object
 * @returns {Object} Formatted error object
 */
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return {
          type: 'UNAUTHORIZED',
          message: 'Invalid API key. Please check your TMDB API credentials.',
          status,
        };
      case 404:
        return {
          type: 'NOT_FOUND',
          message: 'The requested resource was not found.',
          status,
        };
      case 429:
        return {
          type: 'RATE_LIMIT',
          message: 'Rate limit exceeded. Please try again later.',
          status,
        };
      case 500:
        return {
          type: 'SERVER_ERROR',
          message: 'TMDB server error. Please try again later.',
          status,
        };
      default:
        return {
          type: 'API_ERROR',
          message: data?.status_message || 'An error occurred while fetching data.',
          status,
        };
    }
  } else if (error.request) {
    // Request was made but no response received
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your internet connection.',
      status: null,
    };
  } else {
    // Something else happened
    return {
      type: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred.',
      status: null,
    };
  }
};

/**
 * ==========================================
 * MOVIE ENDPOINTS
 * ==========================================
 */

/**
 * Get trending movies
 * @param {string} timeWindow - 'day' or 'week'
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Trending movies data
 */
export const getTrendingMovies = async (timeWindow = 'day', page = 1) => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
      params: { page },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get popular movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Popular movies data
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get top rated movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Top rated movies data
 */
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get upcoming movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Upcoming movies data
 */
export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { 
        page,
        region: tmdbConfig.defaultRegion,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get now playing movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Now playing movies data
 */
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { 
        page,
        region: tmdbConfig.defaultRegion,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get movie details by ID
 * @param {number} movieId - TMDB movie ID
 * @param {string} appendToResponse - Additional data to include (comma-separated)
 * @returns {Promise} Movie details data
 */
export const getMovieDetails = async (movieId, appendToResponse = 'credits,videos,similar') => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: { 
        append_to_response: appendToResponse,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Search movies by query
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Search results data
 */
export const searchMovies = async (query, page = 1) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    const response = await tmdbApi.get('/search/movie', {
      params: { 
        query: query.trim(),
        page,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get movie credits (cast and crew)
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise} Movie credits data
 */
export const getMovieCredits = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get similar movies
 * @param {number} movieId - TMDB movie ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Similar movies data
 */
export const getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
      params: { page },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get movie videos (trailers, teasers, etc.)
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise} Movie videos data
 */
export const getMovieVideos = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * ==========================================
 * CONFIGURATION ENDPOINTS
 * ==========================================
 */

/**
 * Get TMDB API configuration
 * This includes image base URLs and available sizes
 * @returns {Promise} Configuration data
 */
export const getConfiguration = async () => {
  try {
    const response = await tmdbApi.get('/configuration');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * ==========================================
 * UTILITY FUNCTIONS
 * ==========================================
 */

/**
 * Get movie recommendations
 * @param {number} movieId - TMDB movie ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Recommended movies data
 */
export const getMovieRecommendations = async (movieId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
      params: { page },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get movies by genre
 * @param {number|Array<number>} genreId - TMDB genre ID or array of IDs
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Movies data
 */
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const genreIds = Array.isArray(genreId) ? genreId.join(',') : genreId;
    const response = await tmdbApi.get('/discover/movie', {
      params: { 
        with_genres: genreIds,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get movie genres list
 * @returns {Promise} Genres list data
 */
export const getMovieGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Discover movies with multiple filters
 * @param {Object} filters - Filter options
 * @param {number|Array<number>} filters.genreId - Genre ID(s)
 * @param {string} filters.sortBy - Sort order (e.g., 'popularity.desc', 'vote_average.desc')
 * @param {string} filters.releaseDateGte - Minimum release date (YYYY-MM-DD)
 * @param {string} filters.releaseDateLte - Maximum release date (YYYY-MM-DD)
 * @param {number} filters.voteAverageGte - Minimum vote average
 * @param {number} filters.voteAverageLte - Maximum vote average
 * @param {string} filters.language - Original language (e.g., 'en')
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Discovered movies data
 */
export const discoverMovies = async (filters = {}, page = 1) => {
  try {
    const genreIds = filters.genreId 
      ? (Array.isArray(filters.genreId) ? filters.genreId.join(',') : filters.genreId)
      : undefined;

    const response = await tmdbApi.get('/discover/movie', {
      params: {
        page,
        sort_by: filters.sortBy || 'popularity.desc',
        with_genres: genreIds,
        'primary_release_date.gte': filters.releaseDateGte,
        'primary_release_date.lte': filters.releaseDateLte,
        'vote_average.gte': filters.voteAverageGte,
        'vote_average.lte': filters.voteAverageLte,
        with_original_language: filters.language,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get movie reviews
 * @param {number} movieId - TMDB movie ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} Movie reviews data
 */
export const getMovieReviews = async (movieId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/reviews`, {
      params: { page },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * ==========================================
 * DEFAULT EXPORT
 * ==========================================
 */

const tmdbService = {
  // Movie endpoints
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getMovieDetails,
  searchMovies,
  getMovieCredits,
  getSimilarMovies,
  getMovieVideos,
  
  // Configuration
  getConfiguration,
  
  // Additional utilities
  getMovieRecommendations,
  getMoviesByGenre,
  getMovieGenres,
  getMovieReviews,
  discoverMovies,
};

export default tmdbService;
