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
