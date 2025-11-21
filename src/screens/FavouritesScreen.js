import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import FavoriteMovieCard from '../components/FavoriteMovieCard';
import EmptyFavorites from '../components/EmptyFavorites';

const FavouritesScreen = ({ navigation }) => {
  const { 
    favorites, 
    loading, 
    removeFavorite, 
    reloadFavorites,
    favoritesCount 
  } = useFavorites();
  
  const [refreshing, setRefreshing] = useState(false);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reloadFavorites();
    setRefreshing(false);
  }, [reloadFavorites]);

  // Navigate to movie details
  const handleMoviePress = (movieId) => {
    navigation.navigate('Details', { movieId });
  };

  // Handle remove from favorites
  const handleRemoveFavorite = (movieId, movieTitle) => {
    removeFavorite(movieId);
    // Optional: Show toast notification
    console.log(`Removed "${movieTitle}" from favorites`);
  };

  // Render movie card
  const renderMovieCard = ({ item }) => (
    <FavoriteMovieCard
      movie={item}
      onPress={() => handleMoviePress(item.id)}
      onRemove={() => handleRemoveFavorite(item.id, item.title)}
      showRemoveButton={true}
    />
  );

  // Show loading spinner on initial load
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  // Show empty state if no favorites
  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>0 movies saved</Text>
        </View>
        <EmptyFavorites />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favoritesCount} {favoritesCount === 1 ? 'movie' : 'movies'} saved
        </Text>
      </View>

      {/* Favorites Grid */}
      <FlatList
        data={favorites}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E50914"
            colors={['#E50914']}
          />
        }
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#121212',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default FavouritesScreen;