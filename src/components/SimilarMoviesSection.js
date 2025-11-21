/**
 * SimilarMoviesSection Component
 * Displays a horizontal list of similar movies
 * Used in movie details screen
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';

const SimilarMoviesSection = ({ movies, onMoviePress, title = 'Similar Movies' }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  const renderMovie = ({ item }) => (
    <MovieCard 
      movie={item} 
      onPress={() => onMoviePress(item)}
      style={styles.movieCard}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  movieCard: {
    marginRight: 12,
  },
});

export default SimilarMoviesSection;
