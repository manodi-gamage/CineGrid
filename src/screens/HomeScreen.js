/**
 * HomeScreen Component
 * 
 * Main home screen displaying trending movies carousel and multiple category sections
 * Features: pull-to-refresh, loading states, error handling, navigation to details
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../features/auth';
import tmdbService from '../services/tmdbService';
import MovieCarousel from '../components/MovieCarousel';
import CategorySection from '../components/CategorySection';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Movie data state
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  /**
   * Fetch all movie data from TMDB API
   */
  const fetchMovies = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      // Fetch all categories in parallel
      const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
        tmdbService.getTrendingMovies('day', 1),
        tmdbService.getPopularMovies(1),
        tmdbService.getTopRatedMovies(1),
        tmdbService.getUpcomingMovies(1),
      ]);

      setTrending(trendingData.results || []);
      setPopular(popularData.results || []);
      setTopRated(topRatedData.results || []);
      setUpcoming(upcomingData.results || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMovies(true);
  }, []);

  /**
   * Navigate to movie details
   */
  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  /**
   * Navigate to category list (See All)
   */
  const handleSeeAll = (category, title) => {
    // TODO: Navigate to CategoryList screen when implemented
    console.log('See all:', category);
    // navigation.navigate('CategoryList', { category, title });
  };

  /**
   * Navigate to search screen
   */
  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  /**
   * Navigate to profile screen
   */
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  // Load movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  /**
   * Render error state
   */
  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchMovies()}>
            <Ionicons name="refresh" size={20} color={colors.dark} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render loading state
   */
  if (loading) {
    return <LoadingSpinner text="Loading movies..." />;
  }

  // Get user's first name
  const firstName = user?.firstName || user?.username || 'Guest';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Welcome back, {firstName}!</Text>
          <Text style={styles.subtitle}>What do you want to watch today?</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearchPress}
            accessibilityLabel="Search movies"
          >
            <Ionicons name="search" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleProfilePress}
            accessibilityLabel="Profile"
          >
            <Ionicons name="person-circle-outline" size={28} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.cyan}
            colors={[colors.cyan]}
          />
        }
      >
        {/* Trending Movies Carousel */}
        {trending.length > 0 && (
          <View style={styles.carouselSection}>
            <Text style={styles.sectionTitle}>🔥 Trending Today</Text>
            <MovieCarousel movies={trending} onMoviePress={handleMoviePress} />
          </View>
        )}

        {/* Popular Movies */}
        <CategorySection
          title="Popular Movies"
          movies={popular}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => handleSeeAll('popular', 'Popular Movies')}
        />

        {/* Top Rated Movies */}
        <CategorySection
          title="Top Rated"
          movies={topRated}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => handleSeeAll('top_rated', 'Top Rated')}
        />

        {/* Upcoming Movies */}
        <CategorySection
          title="Coming Soon"
          movies={upcoming}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => handleSeeAll('upcoming', 'Coming Soon')}
        />

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  carouselSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
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
  bottomSpacing: {
    height: 32,
  },
});

export default HomeScreen;