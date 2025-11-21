/**
 * MovieCard Component
 * 
 * Displays individual movie card with poster, title, and rating
 * Used in horizontal lists and category sections
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPosterUrl, getReleaseYear, formatVoteAverage } from '../utils/imageHelper';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 150;
const CARD_HEIGHT = 240;

const MovieCard = ({ movie, onPress }) => {
  if (!movie) return null;

  const posterUrl = getPosterUrl(movie.poster_path);
  const year = getReleaseYear(movie.release_date);
  const rating = formatVoteAverage(movie.vote_average);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`${movie.title}, rated ${rating}`}
    >
      {/* Movie Poster */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
        
        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={colors.orange} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}
      </View>

      {/* Movie Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {movie.title}
        </Text>
        {year !== 'N/A' && (
          <Text style={styles.year}>{year}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 12,
  },
  posterContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT - 50,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.dark,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Android shadow
    elevation: 5,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  infoContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  year: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

export default MovieCard;
