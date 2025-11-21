// src/features/auth/authStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: '@cinegrid_access_token',
  REFRESH_TOKEN: '@cinegrid_refresh_token',
  USER_DATA: '@cinegrid_user_data',
  HAS_LAUNCHED: '@cinegrid_has_launched',
};

/**
 * Store authentication tokens securely
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const storeTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      [AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw new Error('Failed to store authentication tokens');
  }
};

/**
 * Retrieve access token
 * @returns {Promise<string|null>} Access token or null
 */
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Retrieve refresh token
 * @returns {Promise<string|null>} Refresh token or null
 */
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Store user data
 * @param {Object} userData - User information object
 */
export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData)
    );
  } catch (error) {
    console.error('Error storing user data:', error);
    throw new Error('Failed to store user data');
  }
};

/**
 * Retrieve user data
 * @returns {Promise<Object|null>} User data object or null
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      AUTH_STORAGE_KEYS.ACCESS_TOKEN,
      AUTH_STORAGE_KEYS.REFRESH_TOKEN,
      AUTH_STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw new Error('Failed to clear authentication data');
  }
};

/**
 * Check if user has launched the app before (for onboarding)
 * @returns {Promise<boolean>} True if user has launched before
 */
export const hasLaunchedBefore = async () => {
  try {
    const value = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.HAS_LAUNCHED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking launch status:', error);
    return false;
  }
};

/**
 * Mark that the app has been launched
 */
export const setHasLaunched = async () => {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEYS.HAS_LAUNCHED, 'true');
  } catch (error) {
    console.error('Error setting launch status:', error);
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user has valid tokens
 */
export const isAuthenticated = async () => {
  try {
    const accessToken = await getAccessToken();
    return !!accessToken;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
