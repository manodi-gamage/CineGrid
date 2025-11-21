/**
 * MovieCarousel Component
 * 
 * Featured carousel for trending movies with large backdrop images
 * Includes auto-scroll, pagination dots, and snap-to-interval
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getBackdropUrl, formatVoteAverage } from '../utils/imageHelper';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 400;
const CARD_WIDTH = width - 32;

const MovieCarousel = ({ movies, onMoviePress }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle scroll and update active index
  const onScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offset / slideSize);
    setActiveIndex(currentIndex);
  };

  // Render pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {movies.slice(0, 5).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    );
  };

  // Render individual carousel item
  const renderItem = ({ item }) => {
    const backdropUrl = getBackdropUrl(item.backdrop_path || item.poster_path);
    const rating = formatVoteAverage(item.vote_average);

    return (
      <TouchableOpacity
        style={styles.carouselItem}
        onPress={() => onMoviePress(item)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: backdropUrl }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
        >
          <View style={styles.infoContainer}>
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color={colors.orange} />
              <Text style={styles.rating}>{rating}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Overview */}
            {item.overview && (
              <Text style={styles.overview} numberOfLines={3}>
                {item.overview}
              </Text>
            )}

            {/* Watch Now Button */}
            <TouchableOpacity
              style={styles.watchButton}
              onPress={() => onMoviePress(item)}
            >
              <Ionicons name="play-circle" size={24} color={colors.white} />
              <Text style={styles.watchText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movies.slice(0, 5)} // Show only first 5 trending movies
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + 32}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    marginBottom: 8,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  carouselItem: {
    width: CARD_WIDTH,
    height: CAROUSEL_HEIGHT - 40,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: colors.dark,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    padding: 20,
    paddingBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  overview: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cyan,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  watchText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.cyan,
    width: 24,
  },
});

export default MovieCarousel;
