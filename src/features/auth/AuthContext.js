// src/features/auth/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from './authService';
import {
  getUserData,
  isAuthenticated as checkIsAuthenticated,
  clearAuthData,
} from './authStorage';

// Create the authentication context
const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  updateUserProfile: async () => {},
});

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth functions to the app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize authentication state on app load
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if user is authenticated and load user data
   */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await checkIsAuthenticated();
      
      if (authenticated) {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data, try to fetch from API
          try {
            const freshUserData = await getCurrentUser();
            setUser(freshUserData);
            setIsAuthenticated(true);
          } catch (error) {
            // Failed to get user data, clear auth
            await clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data
   */
  const login = async (username, password) => {
    try {
      const userData = await loginService(username, password);
      
      // Extract user info (without tokens)
      const { accessToken, refreshToken, ...userInfo } = userData;
      
      setUser(userInfo);
      setIsAuthenticated(true);
      
      return userInfo;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if service fails
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  /**
   * Refresh user data from API
   */
  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  /**
   * Update user profile data locally
   * @param {Object} updates - Profile updates (e.g., { image: 'uri' })
   */
  const updateUserProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Store updated user data
      const { storeUserData } = require('./authStorage');
      await storeUserData(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
