/**
 * DetailsScreen Component
 * Comprehensive movie details screen with backdrop, cast, trailers, and similar movies
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { getMovieDetails } from '../services/tmdbService';
import { getPosterUrl, getBackdropUrl } from '../config/tmdbConfig';
import { formatRuntime, getYearFromDate, formatMoney } from '../utils/formatters';
import { colors } from '../utils/colors';
import GenreTag from '../components/GenreTag';
import MovieStats from '../components/MovieStats';
import CastCard from '../components/CastCard';
import TrailerCard from '../components/TrailerCard';
import SimilarMoviesSection from '../components/SimilarMoviesSection';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');
const BACKDROP_HEIGHT = 300;
const POSTER_WIDTH = 150;
const POSTER_HEIGHT = 225;

const DetailsScreen = ({ route, navigation }) => {
  const { movieId } = route.params;

  // State
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    loadMovieDetails();
    checkIfFavorite();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMovieDetails(movieId, 'credits,videos,similar');
      
      setMovie(data);
      
      // Extract cast (first 10)
      if (data.credits?.cast) {
        const sortedCast = data.credits.cast
          .sort((a, b) => a.order - b.order)
          .slice(0, 10);
        setCast(sortedCast);
      }
      
      // Extract trailers and teasers
      if (data.videos?.results) {
        const filteredVideos = data.videos.results.filter(
          (video) => 
            video.site === 'YouTube' && 
            (video.type === 'Trailer' || video.type === 'Teaser')
        );
        setVideos(filteredVideos);
      }
      
      // Extract similar movies
      if (data.similar?.results) {
        setSimilar(data.similar.results.slice(0, 10));
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading movie details:', err);
      setError(err.message || 'Failed to load movie details');
      setLoading(false);
      
      Alert.alert(
        'Error',
        'Failed to load movie details. Please try again.',
        [
          { text: 'Go Back', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: loadMovieDetails },
        ]
      );
    }
  };

  const checkIfFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      setIsFavorite(favorites.includes(movieId));
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter((id) => id !== movieId);
        setIsFavorite(false);
      } else {
        // Add to favorites
        favorites.push(movieId);
        setIsFavorite(true);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleSimilarMoviePress = (selectedMovie) => {
    navigation.push('Details', { movieId: selectedMovie.id });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMovieDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? getBackdropUrl(movie.backdrop_path, 'original')
    : movie.poster_path 
      ? getPosterUrl(movie.poster_path, 'w500')
      : null;

  const posterUrl = movie.poster_path 
    ? getPosterUrl(movie.poster_path, 'w500')
    : null;

  const director = movie.credits?.crew?.find((person) => person.job === 'Director');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* BACKDROP SECTION */}
      <View style={styles.backdropContainer}>
        {backdropUrl ? (
          <Image 
            source={{ uri: backdropUrl }} 
            style={styles.backdrop}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.backdrop, styles.backdropPlaceholder]} />
        )}
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)', colors.background]}
          style={styles.backdropGradient}
        />
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={toggleFavorite}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      {/* MOVIE INFO SECTION */}
      <View style={styles.contentContainer}>
        <View style={styles.movieInfoSection}>
          {/* Poster (overlapping backdrop) */}
          {posterUrl && (
            <View style={styles.posterContainer}>
              <Image 
                source={{ uri: posterUrl }} 
                style={styles.poster}
                resizeMode="cover"
              />
            </View>
          )}
          
          {/* Title and Metadata */}
          <View style={[styles.movieInfo, posterUrl && styles.movieInfoWithPoster]}>
            <Text style={styles.title}>{movie.title}</Text>
            
            {movie.tagline && (
              <Text style={styles.tagline}>{movie.tagline}</Text>
            )}
            
            {/* Release Year • Runtime • Rating */}
            <View style={styles.metadataRow}>
              {movie.release_date && (
                <Text style={styles.metadata}>{getYearFromDate(movie.release_date)}</Text>
              )}
              {movie.runtime > 0 && (
                <>
                  <Text style={styles.metadataSeparator}>•</Text>
                  <Text style={styles.metadata}>{formatRuntime(movie.runtime)}</Text>
                </>
              )}
              {movie.vote_average > 0 && (
                <>
                  <Text style={styles.metadataSeparator}>•</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {movie.vote_average.toFixed(1)}</Text>
                  </View>
                </>
              )}
            </View>
            
            {/* Genre Tags */}
            {movie.genres && movie.genres.length > 0 && (
              <View style={styles.genresContainer}>
                {movie.genres.map((genre) => (
                  <GenreTag key={genre.id} genre={genre.name} />
                ))}
              </View>
            )}
          </View>
        </View>

        {/* RATING & STATS SECTION */}
        <MovieStats 
          rating={movie.vote_average}
          voteCount={movie.vote_count}
          runtime={movie.runtime}
          popularity={movie.popularity}
          status={movie.status}
        />

        {/* OVERVIEW SECTION */}
        {movie.overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text 
              style={styles.overview}
              numberOfLines={showFullOverview ? undefined : 5}
            >
              {movie.overview}
            </Text>
            {movie.overview.length > 200 && (
              <TouchableOpacity onPress={() => setShowFullOverview(!showFullOverview)}>
                <Text style={styles.readMore}>
                  {showFullOverview ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* CAST SECTION */}
        {cast.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cast</Text>
            </View>
            
            <FlatList
              data={cast}
              renderItem={({ item }) => <CastCard cast={item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* TRAILERS SECTION */}
        {videos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trailers & Videos</Text>
            
            <FlatList
              data={videos}
              renderItem={({ item }) => <TrailerCard video={item} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* SIMILAR MOVIES SECTION */}
        {similar.length > 0 && (
          <SimilarMoviesSection 
            movies={similar}
            onMoviePress={handleSimilarMoviePress}
          />
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          {director && (
            <Text style={styles.footerText}>
              <Text style={styles.footerLabel}>Director: </Text>
              {director.name}
            </Text>
          )}
          
          {movie.production_companies && movie.production_companies.length > 0 && (
            <Text style={styles.footerText}>
              <Text style={styles.footerLabel}>Production: </Text>
              {movie.production_companies.map(c => c.name).join(', ')}
            </Text>
          )}
          
          {(movie.budget > 0 || movie.revenue > 0) && (
            <View style={styles.budgetRow}>
              {movie.budget > 0 && (
                <Text style={styles.footerText}>
                  <Text style={styles.footerLabel}>Budget: </Text>
                  {formatMoney(movie.budget)}
                </Text>
              )}
              {movie.revenue > 0 && (
                <Text style={[styles.footerText, styles.revenueText]}>
                  <Text style={styles.footerLabel}>Revenue: </Text>
                  {formatMoney(movie.revenue)}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdropContainer: {
    width: width,
    height: BACKDROP_HEIGHT,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropPlaceholder: {
    backgroundColor: colors.dark,
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BACKDROP_HEIGHT * 0.6,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
    color: colors.pink,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  movieInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -75,
    marginBottom: 16,
  },
  posterContainer: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.dark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  movieInfo: {
    flex: 1,
  },
  movieInfoWithPoster: {
    marginLeft: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#B0B0B0',
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metadata: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  metadataSeparator: {
    fontSize: 14,
    color: '#B0B0B0',
    marginHorizontal: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  overview: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  readMore: {
    fontSize: 14,
    color: colors.cyan,
    marginTop: 8,
    paddingHorizontal: 16,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  footerLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revenueText: {
    marginLeft: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.cyan,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DetailsScreen;