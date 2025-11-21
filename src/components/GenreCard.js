/**
 * GenreCard Component
 * 
 * Card component for genre selection with movie poster background and fade effect
 * Used in HomeScreen and GenresScreen
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPosterUrl } from '../utils/imageHelper';

const GenreCard = ({ genre, onPress, style }) => {
  if (!genre) return null;

  const [imageError, setImageError] = useState(false);
  const posterUrl = getPosterUrl(genre.posterPath);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${genre.name} genre`}
      accessibilityRole="button"
    >
      {imageError ? (
        // Fallback to solid color background if image fails
        <View style={[styles.fallbackBackground, { backgroundColor: genre.color }]}>
          <View style={styles.content}>
            <Text style={styles.name}>{genre.name}</Text>
          </View>
        </View>
      ) : (
        // Display image background with gradient
        <ImageBackground
          source={{ uri: posterUrl }}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
          onError={() => setImageError(true)}
        >
          {/* Gradient overlay for fade effect */}
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.3)',
              'rgba(0, 0, 0, 0.5)',
              `${genre.color}CC`,
            ]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={styles.name}>{genre.name}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 100,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 16,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  fallbackBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    borderRadius: 16,
  },
  content: {
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default GenreCard;
