/**
 * MovieGridList Component
 * 
 * Reusable component for displaying movies in a 2-column grid layout
 * Features: infinite scroll, pull-to-refresh, loading states, optimized performance
 */

import React, { memo } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieCard from './MovieCard';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2) - COLUMN_GAP) / 2;

/**
 * Memoized MovieCard wrapper for grid layout
 */
const GridMovieCard = memo(({ movie, onPress }) => {
  if (!movie) return null;

  return (
    <View style={styles.cardWrapper}>
      <MovieCard movie={movie} onPress={() => onPress(movie)} />
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.movie.id === nextProps.movie.id;
});

const MovieGridList = ({
  movies = [],
  onEndReached,
  onRefresh,
  refreshing = false,
  loadingMore = false,
  hasMore = true,
  onMoviePress,
  ListEmptyComponent,
  loading = false,
}) => {
  /**
   * Render individual movie item
   */
  const renderItem = ({ item }) => (
    <GridMovieCard movie={item} onPress={onMoviePress} />
  );

  /**
   * Render loading footer during pagination
   */
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={colors.cyan} />
        <Text style={styles.footerText}>Loading more movies...</Text>
      </View>
    );
  };

  /**
   * Render end of list message
   */
  const renderEndMessage = () => {
    if (loadingMore || hasMore || movies.length === 0) return null;

    return (
      <View style={styles.endMessageContainer}>
        <Ionicons name="checkmark-circle-outline" size={24} color={colors.textSecondary} />
        <Text style={styles.endMessageText}>You've reached the end</Text>
      </View>
    );
  };

  /**
   * Render default empty state
   */
  const renderDefaultEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="film-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No movies found</Text>
      <Text style={styles.emptySubtitle}>Try a different category</Text>
    </View>
  );

  /**
   * Item key extractor
   */
  const keyExtractor = (item) => item.id.toString();

  /**
   * Get item layout for optimization
   */
  const getItemLayout = (data, index) => ({
    length: 240, // Approximate card height
    offset: 240 * Math.floor(index / 2),
    index,
  });

  return (
    <FlatList
      data={movies}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[
        styles.contentContainer,
        movies.length === 0 && styles.emptyContentContainer,
      ]}
      showsVerticalScrollIndicator={false}
      
      // Infinite scroll
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      
      // Pull to refresh
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.cyan}
          colors={[colors.cyan]}
        />
      }
      
      // Performance optimizations
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
      
      // Footer components
      ListFooterComponent={
        <View>
          {renderFooter()}
          {renderEndMessage()}
        </View>
      }
      
      // Empty state
      ListEmptyComponent={ListEmptyComponent || renderDefaultEmpty}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  footerContainer: {
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
  endMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  endMessageText: {
    color: colors.textSecondary,
    fontSize: 14,
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

export default memo(MovieGridList);
