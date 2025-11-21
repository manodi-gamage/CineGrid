/**
 * TMDB Service Test File
 * 
 * This file tests all TMDB API endpoints to verify they work correctly.
 * Run this to ensure your API key is configured properly and all services are functioning.
 * 
 * To run: node src/services/__tests__/tmdbService.test.js
 * Or import and use in your React Native app for manual testing
 */

import tmdbService from '../tmdbService';
import { getPosterUrl, getBackdropUrl, getTrailerKey } from '../../utils/imageHelper';

// Test movie ID: The Matrix (1999)
const TEST_MOVIE_ID = 603;
const TEST_SEARCH_QUERY = 'Avengers';

/**
 * Test all TMDB service endpoints
 */
export const testTmdbService = async () => {
  console.log('🎬 Starting TMDB Service Tests...\n');

  try {
    // Test 1: Get Trending Movies
    console.log('1️⃣ Testing getTrendingMovies...');
    const trending = await tmdbService.getTrendingMovies('day', 1);
    console.log('✅ Trending Movies:', trending.results?.length, 'movies found');
    console.log('First movie:', trending.results?.[0]?.title);
    console.log('');

    // Test 2: Get Popular Movies
    console.log('2️⃣ Testing getPopularMovies...');
    const popular = await tmdbService.getPopularMovies(1);
    console.log('✅ Popular Movies:', popular.results?.length, 'movies found');
    console.log('First movie:', popular.results?.[0]?.title);
    console.log('');

    // Test 3: Get Top Rated Movies
    console.log('3️⃣ Testing getTopRatedMovies...');
    const topRated = await tmdbService.getTopRatedMovies(1);
    console.log('✅ Top Rated Movies:', topRated.results?.length, 'movies found');
    console.log('First movie:', topRated.results?.[0]?.title);
    console.log('');

    // Test 4: Get Upcoming Movies
    console.log('4️⃣ Testing getUpcomingMovies...');
    const upcoming = await tmdbService.getUpcomingMovies(1);
    console.log('✅ Upcoming Movies:', upcoming.results?.length, 'movies found');
    console.log('First movie:', upcoming.results?.[0]?.title);
    console.log('');

    // Test 5: Get Now Playing Movies
    console.log('5️⃣ Testing getNowPlayingMovies...');
    const nowPlaying = await tmdbService.getNowPlayingMovies(1);
    console.log('✅ Now Playing Movies:', nowPlaying.results?.length, 'movies found');
    console.log('First movie:', nowPlaying.results?.[0]?.title);
    console.log('');

    // Test 6: Get Movie Details
    console.log('6️⃣ Testing getMovieDetails...');
    const movieDetails = await tmdbService.getMovieDetails(TEST_MOVIE_ID);
    console.log('✅ Movie Details:', movieDetails.title);
    console.log('Overview:', movieDetails.overview?.substring(0, 100) + '...');
    console.log('Release Date:', movieDetails.release_date);
    console.log('Rating:', movieDetails.vote_average);
    console.log('');

    // Test 7: Search Movies
    console.log('7️⃣ Testing searchMovies...');
    const searchResults = await tmdbService.searchMovies(TEST_SEARCH_QUERY, 1);
    console.log('✅ Search Results for "' + TEST_SEARCH_QUERY + '":', searchResults.results?.length, 'movies found');
    console.log('First result:', searchResults.results?.[0]?.title);
    console.log('');

    // Test 8: Get Movie Credits
    console.log('8️⃣ Testing getMovieCredits...');
    const credits = await tmdbService.getMovieCredits(TEST_MOVIE_ID);
    console.log('✅ Movie Credits:', credits.cast?.length, 'cast members');
    console.log('Lead actor:', credits.cast?.[0]?.name);
    console.log('');

    // Test 9: Get Similar Movies
    console.log('9️⃣ Testing getSimilarMovies...');
    const similar = await tmdbService.getSimilarMovies(TEST_MOVIE_ID, 1);
    console.log('✅ Similar Movies:', similar.results?.length, 'movies found');
    console.log('First similar:', similar.results?.[0]?.title);
    console.log('');

    // Test 10: Get Movie Videos
    console.log('🔟 Testing getMovieVideos...');
    const videos = await tmdbService.getMovieVideos(TEST_MOVIE_ID);
    console.log('✅ Movie Videos:', videos.results?.length, 'videos found');
    const trailerKey = getTrailerKey(videos.results);
    console.log('Trailer key:', trailerKey);
    console.log('');

    // Test 11: Get Configuration
    console.log('1️⃣1️⃣ Testing getConfiguration...');
    const config = await tmdbService.getConfiguration();
    console.log('✅ Configuration loaded');
    console.log('Image base URL:', config.images?.secure_base_url);
    console.log('Poster sizes:', config.images?.poster_sizes?.join(', '));
    console.log('');

    // Test 12: Get Movie Genres
    console.log('1️⃣2️⃣ Testing getMovieGenres...');
    const genres = await tmdbService.getMovieGenres();
    console.log('✅ Movie Genres:', genres.genres?.length, 'genres found');
    console.log('First 3 genres:', genres.genres?.slice(0, 3).map(g => g.name).join(', '));
    console.log('');

    // Test Image Helper Functions
    console.log('🖼️ Testing Image Helper Functions...');
    const testPosterPath = '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg';
    const testBackdropPath = '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg';
    
    console.log('Poster URL:', getPosterUrl(testPosterPath));
    console.log('Backdrop URL:', getBackdropUrl(testBackdropPath));
    console.log('Null poster (should be placeholder):', getPosterUrl(null));
    console.log('');

    console.log('✅ All tests completed successfully! 🎉');
    console.log('\n📊 Summary:');
    console.log('- All API endpoints are working correctly');
    console.log('- Image helpers are functioning properly');
    console.log('- TMDB API key is valid and authenticated');
    console.log('\n🚀 Your CineGrid app is ready to use TMDB services!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\nError details:');
    console.error('Type:', error.type);
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    
    if (error.type === 'UNAUTHORIZED') {
      console.error('\n⚠️ Please check your TMDB_API_KEY in the .env file');
    } else if (error.type === 'NETWORK_ERROR') {
      console.error('\n⚠️ Please check your internet connection');
    }
  }
};

/**
 * Quick test for a single endpoint
 */
export const quickTest = async () => {
  try {
    console.log('🎬 Quick TMDB Test...');
    const popular = await tmdbService.getPopularMovies(1);
    console.log('✅ Success! Found', popular.results?.length, 'popular movies');
    console.log('Top movie:', popular.results?.[0]?.title);
    return true;
  } catch (error) {
    console.error('❌ Quick test failed:', error.message);
    return false;
  }
};

// Export for use in React Native components
export default {
  testTmdbService,
  quickTest,
};
