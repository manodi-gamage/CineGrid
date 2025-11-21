import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EmptyFavorites = () => {
  const navigation = useNavigation();

  const handleExploreMovies = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="heart-dislike-outline" size={80} color="#666666" />
      </View>
      
      <Text style={styles.heading}>No favorites yet</Text>
      
      <Text style={styles.subtitle}>
        Start adding movies to your favorites{'\n'}
        to see them here
      </Text>

      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={handleExploreMovies}
        activeOpacity={0.8}
      >
        <Ionicons name="film-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Explore Movies</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#121212',
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#E50914',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EmptyFavorites;
