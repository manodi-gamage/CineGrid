/**
 * GenreCard Component
 * 
 * Card component for genre selection with emoji, name, and custom color
 * Used in HomeScreen and GenresScreen
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const GenreCard = ({ genre, onPress, style }) => {
  if (!genre) return null;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: genre.color }, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${genre.name} genre`}
      accessibilityRole="button"
    >
      <Text style={styles.emoji}>{genre.emoji}</Text>
      <Text style={styles.name}>{genre.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 100,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default GenreCard;
