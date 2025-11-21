/**
 * Pagination Dots Component
 * 
 * Displays navigation dots indicator for onboarding slides
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

const PaginationDots = ({ slides, currentIndex }) => {
  return (
    <View style={styles.container}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 30,
  },
  inactiveDot: {
    backgroundColor: '#3E3E3E',
  },
});

export default PaginationDots;
