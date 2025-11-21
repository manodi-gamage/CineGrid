import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler'; 
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/contexts/FavoritesContext';


export default function App() {
  return (
    <FavoritesProvider>
      <AppNavigator />
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
