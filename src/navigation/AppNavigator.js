// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../utils/colors';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { hasLaunchedBefore, setHasLaunched } from '../features/auth/authStorage';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DetailsScreen from '../screens/DetailsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoryListScreen from '../screens/CategoryListScreen';

const Stack = createStackNavigator();

/**
 * Linking configuration for deep linking and web URLs
 */
const linking = {
  prefixes: ['http://localhost:8081', 'cinegrid://'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Login: 'login',
      Register: 'register',
      Main: {
        path: 'app',
        screens: {
          Home: 'home',
          Favourites: 'favourites',
          Profile: 'profile',
        },
      },
      Details: 'details/:id',
      Search: 'search',
    },
  },
};

/**
 * Navigation component that manages auth-based routing
 */
const Navigation = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isCheckingLaunch, setIsCheckingLaunch] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  /**
   * Check if this is the first time the user is opening the app
   */
  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await hasLaunchedBefore();
      
      if (!hasLaunched) {
        setIsFirstLaunch(true);
        await setHasLaunched();
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    } finally {
      setIsCheckingLaunch(false);
    }
  };

  // Show loading screen while checking authentication and first launch
  if (authLoading || isCheckingLaunch) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.cyan} />
      </View>
    );
  }

  /**
   * Determine initial route based on launch status and authentication
   */
  const getInitialRouteName = () => {
    if (isFirstLaunch) {
      return 'Onboarding';
    }
    if (isAuthenticated) {
      return 'Main';
    }
    return 'Login';
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{ 
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {/* Onboarding - shown on first launch */}
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ gestureEnabled: false }}
        />
        
        {/* Auth Screens */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
        />
        
        {/* Main App */}
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{ gestureEnabled: false }}
        />
        
        {/* Details Screen */}
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ headerShown: false }}
        />
        
        {/* Search Screen */}
        <Stack.Screen
          name="Search"
          component={SearchScreen}
        />
        
        {/* Category List Screen */}
        <Stack.Screen
          name="CategoryList"
          component={CategoryListScreen}
          options={({ route }) => ({
            title: route.params?.title || 'Movies',
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * Main App Navigator with Authentication Provider
 */
const AppNavigator = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;