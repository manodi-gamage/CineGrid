/**
 * CategorySection Component
 * 
 * Reusable section component for movie categories
 * Includes header with "See All" button and horizontal movie list
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieCard from './MovieCard';
import { colors } from '../utils/colors';

const CategorySection = ({
  title,
  movies,
  onMoviePress,
  onSeeAllPress,
  showSeeAll = true,
}) => {
  // Render empty state
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showSeeAll && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={onSeeAllPress}
            accessibilityLabel={`See all ${title}`}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.cyan}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Movie List */}
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => onMoviePress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export default CategorySection;
