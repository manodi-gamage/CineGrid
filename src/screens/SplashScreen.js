/**
 * Splash Screen Component
 * 
 * Initial loading screen shown on app launch
 * Handles navigation logic based on:
 * - Onboarding completion status
 * - User authentication status
 */

import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { hasCompletedOnboarding } from '../utils/onboardingStorage';
import { useAuth } from '../features/auth/AuthContext';
import { colors } from '../utils/colors';

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load before checking app state
    if (!authLoading) {
      checkAppState();
    }
  }, [authLoading, isAuthenticated]);

  const checkAppState = async () => {
    try {
      // Wait minimum time for branding (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const onboardingComplete = await hasCompletedOnboarding();

      if (!onboardingComplete) {
        // First time user - show onboarding
        navigation.replace('Onboarding');
      } else if (isAuthenticated) {
        // User logged in - go to app
        navigation.replace('Main');
      } else {
        // Not logged in - go to login
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error in splash screen:', error);
      // Default to login on error
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background Orbs */}
      <View style={styles.backgroundGradients} pointerEvents="none">
        {/* Pink Orb - Top Left */}
        <Svg style={styles.gradientOrb1} viewBox="0 0 300 300">
          <Defs>
            <RadialGradient id="pinkGradientSplash" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgb(255, 53, 184)" stopOpacity="0.8" />
              <Stop offset="40%" stopColor="rgb(255, 53, 184)" stopOpacity="0.4" />
              <Stop offset="70%" stopColor="rgb(255, 53, 184)" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="rgb(255, 53, 184)" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="150" cy="150" r="150" fill="url(#pinkGradientSplash)" />
        </Svg>

        {/* Cyan Orb - Bottom Right */}
        <Svg style={styles.gradientOrb2} viewBox="0 0 400 400">
          <Defs>
            <RadialGradient id="cyanGradientSplash" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgb(0, 250, 254)" stopOpacity="0.8" />
              <Stop offset="40%" stopColor="rgb(0, 250, 254)" stopOpacity="0.4" />
              <Stop offset="70%" stopColor="rgb(0, 250, 254)" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="rgb(0, 250, 254)" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="200" cy="200" r="200" fill="url(#cyanGradientSplash)" />
        </Svg>
      </View>

      {/* App Logo */}
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
      />
      
      {/* App Name */}
      <Text style={styles.appName}>CineGRID</Text>
      <Text style={styles.tagline}>Your Personal Movie Companion</Text>
      
      {/* Loading Indicator */}
      <ActivityIndicator
        size="large"
        color={colors.cyan}
        style={styles.loader}
      />
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
  backgroundGradients: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientOrb1: {
    position: 'absolute',
    width: 600,
    height: 600,
    top: -150,
    left: -200,
  },
  gradientOrb2: {
    position: 'absolute',
    width: 600,
    height: 600,
    bottom: -200,
    right: -200,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 30,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
