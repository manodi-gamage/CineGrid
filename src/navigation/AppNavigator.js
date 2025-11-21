// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../utils/colors';
import { AuthProvider } from '../features/auth/AuthContext';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DetailsScreen from '../screens/DetailsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SplashScreen from '../screens/SplashScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import GenresScreen from '../screens/GenresScreen';

const Stack = createStackNavigator();

/**
 * Linking configuration for deep linking and web URLs
 */
const linking = {
  prefixes: ['http://localhost:8081', 'cinegrid://'],
  config: {
    screens: {
      Splash: 'splash',
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
 * Navigation Stack Component
 */
const Navigation = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ 
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {/* Splash Screen - Always shown first */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ gestureEnabled: false }}
        />
        
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
        
        {/* Genres Screen */}
        <Stack.Screen
          name="Genres"
          component={GenresScreen}
          options={{
            title: 'Browse Genres',
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
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

export default AppNavigator;