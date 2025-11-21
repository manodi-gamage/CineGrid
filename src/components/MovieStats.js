/**
 * MovieStats Component
 * Displays movie statistics (rating, votes, runtime, etc.)
 * Used in movie details screen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatRuntime, formatNumber } from '../utils/formatters';

const MovieStats = ({ rating, voteCount, runtime, popularity, status }) => {
  return (
    <View style={styles.container}>
      {/* Rating */}
      {rating && (
        <View style={styles.statItem}>
          <Text style={styles.ratingValue}>⭐ {rating.toFixed(1)}/10</Text>
          {voteCount && (
            <Text style={styles.voteCount}>({formatNumber(voteCount)} votes)</Text>
          )}
        </View>
      )}
      
      {/* Runtime and Status */}
      <View style={styles.metaContainer}>
        {runtime > 0 && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Runtime</Text>
            <Text style={styles.metaValue}>{formatRuntime(runtime)}</Text>
          </View>
        )}
        
        {status && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.metaValue}>{status}</Text>
          </View>
        )}
        
        {popularity && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Popularity</Text>
            <Text style={styles.metaValue}>{popularity.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  metaItem: {
    marginRight: 24,
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default MovieStats;
