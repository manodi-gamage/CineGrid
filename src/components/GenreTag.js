/**
 * GenreTag Component
 * Displays a genre name in a pill-shaped badge
 * Used in movie details and movie cards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GenreTag = ({ genre, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{genre}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default GenreTag;
