/**
 * RecentSearches Component
 * 
 * Displays list of recent search queries with ability to:
 * - Tap to search again
 * - Delete individual searches
 * - Clear all searches
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const RecentSearches = ({ 
  searches = [], 
  onSearchPress, 
  onDelete, 
  onClearAll 
}) => {
  // Don't render if no recent searches
  if (searches.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Search for movies, actors, or genres</Text>
          <Text style={styles.emptySubtext}>Your recent searches will appear here</Text>
        </View>
      </View>
    );
  }

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchItem}
      onPress={() => onSearchPress(item)}
      activeOpacity={0.7}
    >
      <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
      <Text style={styles.searchText}>{item}</Text>
      <TouchableOpacity
        onPress={() => onDelete(item)}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Searches</Text>
        <TouchableOpacity 
          onPress={onClearAll}
          style={styles.clearAllButton}
        >
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Search List */}
      <FlatList
        data={searches}
        renderItem={renderSearchItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearAllButton: {
    padding: 4,
  },
  clearAllText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  searchText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 15,
    marginLeft: 12,
  },
  deleteButton: {
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#2a2a2a',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RecentSearches;
