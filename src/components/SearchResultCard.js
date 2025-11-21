/**
 * SearchResultCard Component
 * 
 * Compact movie card designed for 2-column grid layout in search results
 * Displays poster, title, year, and rating
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
import { getImageUrl } from '../utils/imageHelper';
import { colors } from '../utils/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2; // 16px padding on sides + 12px gap

const SearchResultCard = ({ movie, onPress }) => {
  if (!movie) return null;

  const posterUrl = getImageUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
      accessibilityLabel={`${movie.title}, ${year}, Rating ${rating}`}
    >
      {/* Movie Poster */}
      <View style={styles.posterContainer}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Ionicons name="film-outline" size={40} color={colors.textSecondary} />
          </View>
        )}
        
        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#FFD700" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}
      </View>

      {/* Movie Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{year}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  posterContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5, // 2:3 aspect ratio
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  infoContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  year: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default SearchResultCard;
