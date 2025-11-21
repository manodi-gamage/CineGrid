/**
 * SearchScreen Component
 * 
 * Complete movie search functionality with:
 * - Real-time debounced search (500ms)
 * - Recent searches with AsyncStorage
 * - Pagination/infinite scroll
 * - Loading, empty, and error states
 * - Navigation to movie details
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tmdbService from '../services/tmdbService';
import SearchBar from '../components/SearchBar';
import SearchResultCard from '../components/SearchResultCard';
import RecentSearches from '../components/RecentSearches';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';
import {
  saveSearch,
  getRecentSearches,
  deleteSearch,
  clearAllSearches,
} from '../utils/searchStorage';

const SearchScreen = ({ navigation }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Refs for debouncing and pagination
  const debounceTimer = useRef(null);
  const isSearching = useRef(false);

  /**
   * Load recent searches on mount
   */
  useEffect(() => {
    loadRecentSearches();
  }, []);

  /**
   * Debounced search effect
   * Triggers search 500ms after user stops typing
   */
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Don't search if query is too short
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setError(null);
      setPage(1);
      setTotalPages(0);
      setHasMore(false);
      return;
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      performSearch(searchQuery, 1);
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  /**
   * Load recent searches from storage
   */
  const loadRecentSearches = async () => {
    try {
      const searches = await getRecentSearches();
      setRecentSearches(searches);
    } catch (err) {
      console.error('Error loading recent searches:', err);
    }
  };

  /**
   * Perform search API call
   */
  const performSearch = async (query, pageNum = 1) => {
    // Prevent duplicate searches
    if (isSearching.current) {
      return;
    }

    try {
      isSearching.current = true;
      
      if (pageNum === 1) {
        setInitialLoading(true);
        setSearchResults([]);
      } else {
        setLoadingMore(true);
      }
      
      setLoading(true);
      setError(null);

      const response = await tmdbService.searchMovies(query, pageNum);
      
      if (response.results) {
        if (pageNum === 1) {
          setSearchResults(response.results);
          // Save search if results found
          if (response.results.length > 0) {
            await saveSearch(query);
            await loadRecentSearches();
          }
        } else {
          // Append results for pagination
          setSearchResults(prev => [...prev, ...response.results]);
        }

        setPage(pageNum);
        setTotalPages(response.total_pages || 0);
        setHasMore(pageNum < (response.total_pages || 0));
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setLoadingMore(false);
      isSearching.current = false;
    }
  };

  /**
   * Handle search query change
   */
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  /**
   * Handle clear search
   */
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setPage(1);
    setTotalPages(0);
    setHasMore(false);
  };

  /**
   * Handle recent search press
   */
  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    Keyboard.dismiss();
  };

  /**
   * Handle delete recent search
   */
  const handleDeleteSearch = async (query) => {
    try {
      await deleteSearch(query);
      await loadRecentSearches();
    } catch (err) {
      console.error('Error deleting search:', err);
    }
  };

  /**
   * Handle clear all recent searches
   */
  const handleClearAllSearches = async () => {
    try {
      await clearAllSearches();
      setRecentSearches([]);
    } catch (err) {
      console.error('Error clearing searches:', err);
    }
  };

  /**
   * Handle movie press - navigate to details
   */
  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  /**
   * Handle load more (pagination)
   */
  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore && searchQuery.trim().length >= 2) {
      performSearch(searchQuery, page + 1);
    }
  };

  /**
   * Render search result item
   */
  const renderSearchResult = useCallback(({ item }) => (
    <SearchResultCard movie={item} onPress={handleMoviePress} />
  ), []);

  /**
   * Render list footer (loading more indicator)
   */
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.cyan} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    if (loading || initialLoading) return null;

    // Show recent searches when no query entered
    if (searchQuery.trim().length === 0) {
      return (
        <RecentSearches
          searches={recentSearches}
          onSearchPress={handleRecentSearchPress}
          onDelete={handleDeleteSearch}
          onClearAll={handleClearAllSearches}
        />
      );
    }

    // Show no results message
    if (searchQuery.trim().length >= 2 && searchResults.length === 0 && !error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="film-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyMessage}>
            No results found for "{searchQuery}"
          </Text>
          <Text style={styles.emptySubtext}>Try different keywords</Text>
        </View>
      );
    }

    return null;
  };

  /**
   * Render error state
   */
  if (error && !loadingMore) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Error State */}
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => searchQuery.trim().length >= 2 && performSearch(searchQuery, 1)}
          >
            <Ionicons name="refresh" size={20} color={colors.dark} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render initial loading state
   */
  if (initialLoading && searchQuery.trim().length >= 2) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.headerSpacer} />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleClearSearch}
          loading={loading}
          autoFocus={false}
        />

        <LoadingSpinner text="Searching movies..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
        loading={loading && !loadingMore}
        autoFocus={true}
      />

      {/* Search Results or Recent Searches */}
      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        onScrollBeginDrag={Keyboard.dismiss}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 32, // Same as back button to center title
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
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
});

export default SearchScreen;
