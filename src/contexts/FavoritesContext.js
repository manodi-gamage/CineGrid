import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  saveFavorites as saveToStorage, 
  loadFavorites as loadFromStorage 
} from '../utils/favoritesStorage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save to AsyncStorage whenever favorites change (skip on initial load)
  useEffect(() => {
    if (!loading) {
      saveFavorites();
    }
  }, [favorites]);

  /**
   * Load favorites from AsyncStorage
   */
  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedFavorites = await loadFromStorage();
      setFavorites(storedFavorites);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save favorites to AsyncStorage
   */
  const saveFavorites = async () => {
    try {
      const success = await saveToStorage(favorites);
      if (!success) {
        setError('Failed to save favorites');
      }
    } catch (err) {
      console.error('Error saving favorites:', err);
      setError('Failed to save favorites');
    }
  };

  /**
   * Add a movie to favorites
   * @param {Object} movie - Movie object to add
   */
  const addFavorite = (movie) => {
    setFavorites(prev => {
      // Check if movie already exists
      if (prev.some(fav => fav.id === movie.id)) {
        return prev;
      }
      
      // Add movie with timestamp
      return [...prev, { 
        ...movie, 
        dateAdded: new Date().toISOString() 
      }];
    });
  };

  /**
   * Remove a movie from favorites
   * @param {number} movieId - ID of movie to remove
   */
  const removeFavorite = (movieId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== movieId));
  };

  /**
   * Check if a movie is in favorites
   * @param {number} movieId - Movie ID to check
   * @returns {boolean} - Whether movie is favorited
   */
  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  /**
   * Toggle favorite status of a movie
   * @param {Object} movie - Movie object to toggle
   * @returns {boolean} - True if added, false if removed
   */
  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
      return false; // Removed
    } else {
      addFavorite(movie);
      return true; // Added
    }
  };

  /**
   * Clear all favorites
   */
  const clearAllFavorites = () => {
    setFavorites([]);
  };

  /**
   * Get array of favorite movie IDs
   * @returns {Array<number>} - Array of movie IDs
   */
  const getFavoriteIds = () => {
    return favorites.map(fav => fav.id);
  };

  /**
   * Get count of favorites
   * @returns {number} - Number of favorites
   */
  const getFavoritesCount = () => {
    return favorites.length;
  };

  /**
   * Get favorites sorted by criteria
   * @param {string} sortBy - 'dateAdded', 'title', 'rating', 'releaseDate'
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} - Sorted favorites array
   */
  const getSortedFavorites = (sortBy = 'dateAdded', order = 'desc') => {
    const sorted = [...favorites];

    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => 
          order === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        );
        break;
      
      case 'rating':
        sorted.sort((a, b) => 
          order === 'asc'
            ? (a.vote_average || 0) - (b.vote_average || 0)
            : (b.vote_average || 0) - (a.vote_average || 0)
        );
        break;
      
      case 'releaseDate':
        sorted.sort((a, b) => {
          const dateA = new Date(a.release_date || 0);
          const dateB = new Date(b.release_date || 0);
          return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      
      case 'dateAdded':
      default:
        sorted.sort((a, b) => {
          const dateA = new Date(a.dateAdded || 0);
          const dateB = new Date(b.dateAdded || 0);
          return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
    }

    return sorted;
  };

  const value = {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
    getFavoriteIds,
    getFavoritesCount,
    getSortedFavorites,
    favoritesCount: favorites.length,
    reloadFavorites: loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Custom hook to use Favorites context
 * @returns {Object} - Favorites context value
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
