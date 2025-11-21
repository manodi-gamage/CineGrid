/**
 * LoadingSpinner Component
 * 
 * Reusable loading indicator with brand colors
 * Displays centered ActivityIndicator with optional text
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

const LoadingSpinner = ({ text = 'Loading...', size = 'large', color = colors.cyan }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default LoadingSpinner;
