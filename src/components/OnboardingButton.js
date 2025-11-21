/**
 * Onboarding Button Component
 * 
 * Reusable button component for onboarding actions (Skip, Next, Get Started)
 * Matches the gradient border style from login page
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';

const OnboardingButton = ({ title, onPress, style, textStyle, variant = 'primary' }) => {
  // Skip button - transparent style
  if (variant === 'skip') {
    return (
      <TouchableOpacity
        style={[styles.skipButton, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.skipText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  // Primary button - gradient border style
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.pink, colors.cyan]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonGradientBorder}
      >
        <View style={styles.buttonInner}>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
  },
  buttonGradientBorder: {
    borderRadius: 25,
    padding: 2,
  },
  buttonInner: {
    backgroundColor: colors.background,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OnboardingButton;
