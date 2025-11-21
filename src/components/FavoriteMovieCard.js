import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../utils/imageHelper';
import RemoveButton from './RemoveButton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with 16px padding on each side and 16px gap
const CARD_HEIGHT = CARD_WIDTH * 1.8; // Maintain aspect ratio for poster

const FavoriteMovieCard = ({ 
  movie, 
  onPress, 
  onRemove, 
  showRemoveButton = true 
}) => {
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  const rating = movie.vote_average 
    ? movie.vote_average.toFixed(1) 
    : 'N/A';

  const posterUrl = getImageUrl(movie.poster_path, 'w342');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showRemoveButton && (
        <RemoveButton onPress={onRemove} />
      )}

      <View style={styles.posterContainer}>
        {movie.poster_path ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderPoster}>
            <Ionicons name="film-outline" size={40} color="#666666" />
          </View>
        )}

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || 'Untitled'}
        </Text>
        <Text style={styles.year}>{releaseYear}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  posterContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  placeholderPoster: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 18,
  },
  year: {
    fontSize: 12,
    color: '#B0B0B0',
  },
});

export default memo(FavoriteMovieCard);
