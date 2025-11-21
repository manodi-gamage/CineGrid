/**
 * TMDB Movie Genres Constants
 * 
 * Complete list of TMDB genres with IDs, emojis, and colors
 * Source: https://api.themoviedb.org/3/genre/movie/list
 */

export const GENRES = [
  { id: 28, name: 'Action', emoji: '💥', color: '#FF6B6B' },
  { id: 12, name: 'Adventure', emoji: '🗺️', color: '#4ECDC4' },
  { id: 16, name: 'Animation', emoji: '🎨', color: '#95E1D3' },
  { id: 35, name: 'Comedy', emoji: '😂', color: '#FFE66D' },
  { id: 80, name: 'Crime', emoji: '🔫', color: '#A8E6CF' },
  { id: 99, name: 'Documentary', emoji: '📽️', color: '#FFDAC1' },
  { id: 18, name: 'Drama', emoji: '🎭', color: '#FF8B94' },
  { id: 10751, name: 'Family', emoji: '👨‍👩‍👧‍👦', color: '#C7CEEA' },
  { id: 14, name: 'Fantasy', emoji: '🧙‍♂️', color: '#B4A7D6' },
  { id: 36, name: 'History', emoji: '📜', color: '#D4A574' },
  { id: 27, name: 'Horror', emoji: '👻', color: '#2C3E50' },
  { id: 10402, name: 'Music', emoji: '🎵', color: '#E8A0BF' },
  { id: 9648, name: 'Mystery', emoji: '🔍', color: '#6C5B7B' },
  { id: 10749, name: 'Romance', emoji: '💕', color: '#FFC0CB' },
  { id: 878, name: 'Science Fiction', emoji: '🚀', color: '#00B4D8' },
  { id: 10770, name: 'TV Movie', emoji: '📺', color: '#90A4AE' },
  { id: 53, name: 'Thriller', emoji: '😱', color: '#B71C1C' },
  { id: 10752, name: 'War', emoji: '⚔️', color: '#8D6E63' },
  { id: 37, name: 'Western', emoji: '🤠', color: '#D4A574' }
];

/**
 * Get genre by ID
 * @param {number} id - TMDB genre ID
 * @returns {Object|undefined} Genre object or undefined
 */
export const getGenreById = (id) => {
  return GENRES.find(genre => genre.id === id);
};

/**
 * Get multiple genres by IDs
 * @param {Array<number>} ids - Array of TMDB genre IDs
 * @returns {Array<Object>} Array of genre objects
 */
export const getGenresByIds = (ids) => {
  if (!Array.isArray(ids)) return [];
  return ids.map(id => getGenreById(id)).filter(Boolean);
};

/**
 * Get genre name by ID
 * @param {number} id - TMDB genre ID
 * @returns {string} Genre name or 'Unknown'
 */
export const getGenreName = (id) => {
  return getGenreById(id)?.name || 'Unknown';
};

/**
 * Get genre names as comma-separated string
 * @param {Array<number>} ids - Array of TMDB genre IDs
 * @returns {string} Comma-separated genre names
 */
export const getGenreNames = (ids) => {
  return getGenresByIds(ids).map(g => g.name).join(', ');
};

/**
 * Get popular genres for home screen
 * @returns {Array<Object>} Most popular 8 genres
 */
export const getPopularGenres = () => {
  // Return most popular genres: Action, Comedy, Horror, Drama, Sci-Fi, Romance, Thriller, Adventure
  const popularIds = [28, 35, 27, 18, 878, 10749, 53, 12];
  return popularIds.map(id => getGenreById(id)).filter(Boolean);
};
