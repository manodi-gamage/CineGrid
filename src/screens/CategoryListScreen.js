/**
 * CategoryListScreen Component
 * 
 * Dynamic screen that displays movies based on category type
 * Features: pagination, infinite scroll, pull-to-refresh, error handling
 * 
 * Supported Categories:
 * - popular → Popular Movies
 * - top_rated → Top Rated Movies
 * - upcoming → Upcoming Movies
 * - now_playing → Now Playing Movies
 * - trending_week → Trending This Week
 * - trending_day → Trending Today
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tmdbService from '../services/tmdbService';
import MovieGridList from '../components/MovieGridList';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';

const CategoryListScreen = ({ route, navigation }) => {
  const { category = 'popular', title = 'Movies', genreId, genreName } = route.params || {};

  // Determine if this is a genre category
  const isGenreCategory = category === 'genre' && genreId;

  // State management
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  /**
   * Map category param to TMDB service function
   */
  const getCategoryMovies = async (categoryType, pageNumber) => {
    // Handle genre category separately
    if (isGenreCategory) {
      return await tmdbService.getMoviesByGenre(genreId, pageNumber);
    }

    // Handle regular categories
    switch (categoryType) {
      case 'popular':
        return await tmdbService.getPopularMovies(pageNumber);
      case 'top_rated':
        return await tmdbService.getTopRatedMovies(pageNumber);
      case 'upcoming':
        return await tmdbService.getUpcomingMovies(pageNumber);
      case 'now_playing':
        return await tmdbService.getNowPlayingMovies(pageNumber);
      case 'trending_day':
        return await tmdbService.getTrendingMovies('day', pageNumber);
      case 'trending_week':
        return await tmdbService.getTrendingMovies('week', pageNumber);
      default:
        return await tmdbService.getPopularMovies(pageNumber);
    }
  };

  /**
   * Load initial movies
   */
  const loadMovies = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      const response = await getCategoryMovies(category, 1);
      
      setMovies(response.results || []);
      setPage(1);
      setTotalPages(response.total_pages || 0);
      setTotalResults(response.total_results || 0);
      setHasMore(1 < response.total_pages);
    } catch (err) {
      console.error('Error loading movies:', err);
      setError(err.message || 'Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Load more movies (pagination)
   */
  const loadMoreMovies = async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getCategoryMovies(category, nextPage);
      
      setMovies(prev => [...prev, ...response.results]);
      setPage(nextPage);
      setHasMore(nextPage < response.total_pages);
    } catch (err) {
      console.error('Error loading more movies:', err);
      // Don't show error for pagination failures, just stop loading
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadMovies(true);
  }, [category]);

  /**
   * Navigate to movie details
   */
  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  /**
   * Retry loading movies after error
   */
  const handleRetry = () => {
    loadMovies();
  };

  /**
   * Load movies on mount or when category changes
   */
  useEffect(() => {
    loadMovies();
  }, [category, genreId]);

  /**
   * Set navigation header title
   */
  useEffect(() => {
    navigation.setOptions({
      title: isGenreCategory ? `${genreName} Movies` : title,
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, isGenreCategory, genreName]);

  /**
   * Render error state
   */
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.errorTitle}>Failed to load movies</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Ionicons name="refresh" size={20} color={colors.dark} />
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="film-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No movies found</Text>
      <Text style={styles.emptySubtitle}>Try a different category</Text>
    </View>
  );

  /**
   * Render loading state
   */
  if (loading && !refreshing) {
    return <LoadingSpinner text="Loading movies..." />;
  }

  /**
   * Render error state
   */
  if (error && !refreshing && movies.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Results count header */}
      {totalResults > 0 && !loading && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {totalResults.toLocaleString()} {totalResults === 1 ? 'movie' : 'movies'}
          </Text>
        </View>
      )}

      {/* Movie Grid List */}
      <MovieGridList
        movies={movies}
        onEndReached={loadMoreMovies}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onMoviePress={handleMoviePress}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardDark,
  },
  resultsText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cyan,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  retryText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CategoryListScreen;
