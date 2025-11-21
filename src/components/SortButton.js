/**
 * SortButton Component
 * 
 * Button to change sort order with dropdown menu
 * Features: display current sort option, toggle sort menu
 */

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const SortButton = ({ currentSort = 'Popularity', onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Sort by ${currentSort}`}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <Ionicons name="swap-vertical" size={18} color={colors.cyan} />
        <Text style={styles.label}>{currentSort}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.cardDark,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 4,
  },
});

export default SortButton;
