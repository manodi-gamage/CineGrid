// src/screens/HomeScreen.js (Example)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tmdbService from '../services/tmdbService';

const HomeScreen = () => {
  useEffect(() => {
    // Test TMDB API - logs will appear in your terminal
    const testApi = async () => {
      console.log('🎬 Starting TMDB API Test...\n');
      
      try {
        // Test 1: Get Popular Movies
        console.log('1️⃣ Testing getPopularMovies...');
        const popular = await tmdbService.getPopularMovies(1);
        console.log('✅ Popular Movies:', popular.results?.length, 'movies found');
        console.log('First movie:', popular.results?.[0]?.title);
        console.log('');

        // Test 2: Get Trending Movies
        console.log('2️⃣ Testing getTrendingMovies...');
        const trending = await tmdbService.getTrendingMovies('day', 1);
        console.log('✅ Trending Movies:', trending.results?.length, 'movies found');
        console.log('First movie:', trending.results?.[0]?.title);
        console.log('');

        // Test 3: Search Movies
        console.log('3️⃣ Testing searchMovies...');
        const search = await tmdbService.searchMovies('Matrix', 1);
        console.log('✅ Search Results:', search.results?.length, 'movies found');
        console.log('First result:', search.results?.[0]?.title);
        console.log('');

        console.log('✅ All tests passed! 🎉');
        console.log('Your TMDB API is working correctly!\n');
        
      } catch (error) {
        console.error('❌ API Test Failed:', error);
        console.error('Error details:', error.message);
      }
    };
    
    testApi();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Home Screen - Trending Movies</Text>
      <Text style={styles.hint}>Check your terminal for API test results!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { marginTop: 20, color: '#666', fontSize: 12 }
});

export default HomeScreen;