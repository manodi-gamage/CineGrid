/**
 * Onboarding Storage Utilities
 * 
 * Manages the onboarding completion status using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'hasCompletedOnboarding';

/**
 * Mark onboarding as complete
 * @returns {Promise<boolean>} Success status
 */
export const setOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    return true;
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
    return false;
  }
};

/**
 * Check if user has completed onboarding
 * @returns {Promise<boolean>} Whether onboarding is complete
 */
export const hasCompletedOnboarding = async () => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Reset onboarding status (useful for testing)
 * @returns {Promise<boolean>} Success status
 */
export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting onboarding:', error);
    return false;
  }
};
