/**
 * TMDB Movie Genres Constants
 * 
 * Complete list of TMDB genres with IDs, colors, and representative movie posters
 * Source: https://api.themoviedb.org/3/genre/movie/list
 */

export const GENRES = [
  { id: 28, name: 'Action', color: '#FF6B6B', posterPath: '/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg' }, // John Wick
  { id: 12, name: 'Adventure', color: '#4ECDC4', posterPath: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg' }, // Indiana Jones
  { id: 16, name: 'Animation', color: '#95E1D3', posterPath: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg' }, // Toy Story
  { id: 35, name: 'Comedy', color: '#FFE66D', posterPath: '/xBHJaX9LMs5NISje9vNBhNCUNvs.jpg' }, // The Hangover
  { id: 80, name: 'Crime', color: '#A8E6CF', posterPath: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' }, // The Godfather
  { id: 99, name: 'Documentary', color: '#FFDAC1', posterPath: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg' }, // Planet Earth
  { id: 18, name: 'Drama', color: '#FF8B94', posterPath: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' }, // The Shawshank Redemption
  { id: 10751, name: 'Family', color: '#C7CEEA', posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' }, // The Lion King
  { id: 14, name: 'Fantasy', color: '#B4A7D6', posterPath: '/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg' }, // Harry Potter
  { id: 36, name: 'History', color: '#D4A574', posterPath: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg' }, // Gladiator
  { id: 27, name: 'Horror', color: '#2C3E50', posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' }, // The Conjuring
  { id: 10402, name: 'Music', color: '#E8A0BF', posterPath: '/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg' }, // Bohemian Rhapsody
  { id: 9648, name: 'Mystery', color: '#6C5B7B', posterPath: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg' }, // Knives Out
  { id: 10749, name: 'Romance', color: '#FFC0CB', posterPath: '/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg' }, // Titanic
  { id: 878, name: 'Science Fiction', color: '#00B4D8', posterPath: '/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg' }, // Interstellar
  { id: 10770, name: 'TV Movie', color: '#90A4AE', posterPath: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg' }, // High School Musical
  { id: 53, name: 'Thriller', color: '#B71C1C', posterPath: '/dqK9Hag1054tghRQSqLSfrkvQnA.jpg' }, // Se7en
  { id: 10752, name: 'War', color: '#8D6E63', posterPath: '/y4TQVpiMGosgjBPnv1XBMzObgNz.jpg' }, // Saving Private Ryan
  { id: 37, name: 'Western', color: '#D4A574', posterPath: '/qVPMTbSJZQeASPHZXENwjmOHPKn.jpg' } // Django Unchained
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
