/**
 * FilterChip Component
 * 
 * Pill-shaped chip button for filtering options
 * Features: active/inactive states, customizable label and onPress
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

const FilterChip = ({ label, active = false, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${label} filter${active ? ', active' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.cardDark,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.cardDark,
  },
  chipActive: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.dark,
    fontWeight: 'bold',
  },
});

export default FilterChip;
