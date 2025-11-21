/**
 * GenresScreen Component
 * 
 * Dedicated screen showing all movie genres in a grid layout
 * Users can tap any genre to see movies in that category
 */

import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GENRES } from '../constants/genres';
import GenreCard from '../components/GenreCard';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2) - COLUMN_GAP) / 2;

const GenresScreen = ({ navigation }) => {
  /**
   * Navigate to CategoryListScreen with genre params
   */
  const handleGenrePress = (genre) => {
    navigation.navigate('CategoryList', {
      category: 'genre',
      genreId: genre.id,
      genreName: genre.name,
      title: `${genre.name} Movies`,
    });
  };

  /**
   * Render individual genre card
   */
  const renderGenreCard = ({ item }) => (
    <GenreCard
      genre={item}
      onPress={() => handleGenrePress(item)}
      style={styles.genreCard}
    />
  );

  /**
   * Key extractor for FlatList
   */
  const keyExtractor = (item) => item.id.toString();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <FlatList
        data={GENRES}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderGenreCard}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: HORIZONTAL_PADDING,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genreCard: {
    width: CARD_WIDTH,
    height: 120,
    marginRight: 0,
  },
});

export default GenresScreen;
