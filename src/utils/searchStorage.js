/**
 * Search Storage Utility
 * 
 * Manages recent search history using AsyncStorage
 * Stores up to 10 most recent unique searches
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@cinegrid_recent_searches';
const MAX_RECENT_SEARCHES = 10;

/**
 * Save a search query to recent searches
 * Adds to the beginning of the list, removes duplicates
 * Limits to MAX_RECENT_SEARCHES items
 * 
 * @param {string} query - The search query to save
 */
export const saveSearch = async (query) => {
  try {
    if (!query || query.trim().length < 2) {
      return;
    }

    const trimmedQuery = query.trim();
    const recentSearches = await getRecentSearches();
    
    // Remove duplicate if exists
    const filteredSearches = recentSearches.filter(
      (search) => search.toLowerCase() !== trimmedQuery.toLowerCase()
    );
    
    // Add new search to the beginning
    const updatedSearches = [trimmedQuery, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error('Error saving search:', error);
  }
};

/**
 * Retrieve all recent searches
 * 
 * @returns {Promise<string[]>} Array of recent search queries
 */
export const getRecentSearches = async () => {
  try {
    const searches = await AsyncStorage.getItem(STORAGE_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

/**
 * Delete a specific search from recent searches
 * 
 * @param {string} query - The search query to delete
 */
export const deleteSearch = async (query) => {
  try {
    const recentSearches = await getRecentSearches();
    const filteredSearches = recentSearches.filter(
      (search) => search.toLowerCase() !== query.toLowerCase()
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSearches));
  } catch (error) {
    console.error('Error deleting search:', error);
  }
};

/**
 * Clear all recent searches
 */
export const clearAllSearches = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing searches:', error);
  }
};
