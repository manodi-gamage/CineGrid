import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'user_favorites';

/**
 * Save favorites array to AsyncStorage
 * @param {Array} favorites - Array of favorite movie objects
 * @returns {Promise<boolean>} - Success status
 */
export const saveFavorites = async (favorites) => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving favorites to AsyncStorage:', error);
    return false;
  }
};

/**
 * Load favorites from AsyncStorage
 * @returns {Promise<Array>} - Array of favorite movies or empty array
 */
export const loadFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    return [];
  } catch (error) {
    console.error('Error loading favorites from AsyncStorage:', error);
    return [];
  }
};

/**
 * Add a single movie to favorites in storage
 * @param {Object} movie - Movie object to add
 * @returns {Promise<Array>} - Updated favorites array
 */
export const addFavoriteToStorage = async (movie) => {
  try {
    const currentFavorites = await loadFavorites();
    
    // Check if movie already exists
    const exists = currentFavorites.some(fav => fav.id === movie.id);
    if (exists) {
      return currentFavorites;
    }

    // Add dateAdded timestamp
    const movieWithDate = {
      ...movie,
      dateAdded: new Date().toISOString(),
    };

    const updatedFavorites = [...currentFavorites, movieWithDate];
    await saveFavorites(updatedFavorites);
    return updatedFavorites;
  } catch (error) {
    console.error('Error adding favorite to storage:', error);
    return [];
  }
};

/**
 * Remove a movie from favorites in storage
 * @param {number} movieId - ID of movie to remove
 * @returns {Promise<Array>} - Updated favorites array
 */
export const removeFavoriteFromStorage = async (movieId) => {
  try {
    const currentFavorites = await loadFavorites();
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== movieId);
    await saveFavorites(updatedFavorites);
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing favorite from storage:', error);
    return [];
  }
};

/**
 * Clear all favorites from storage
 * @returns {Promise<boolean>} - Success status
 */
export const clearFavoritesStorage = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites from storage:', error);
    return false;
  }
};

/**
 * Get count of favorites without loading all data
 * @returns {Promise<number>} - Number of favorites
 */
export const getFavoritesCount = async () => {
  try {
    const favorites = await loadFavorites();
    return favorites.length;
  } catch (error) {
    console.error('Error getting favorites count:', error);
    return 0;
  }
};

/**
 * Check if a movie is in favorites
 * @param {number} movieId - Movie ID to check
 * @returns {Promise<boolean>} - Whether movie is favorited
 */
export const isMovieFavorited = async (movieId) => {
  try {
    const favorites = await loadFavorites();
    return favorites.some(fav => fav.id === movieId);
  } catch (error) {
    console.error('Error checking if movie is favorited:', error);
    return false;
  }
};
