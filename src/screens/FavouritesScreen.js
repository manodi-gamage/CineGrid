// src/screens/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavouritesScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Favourites Screen - Content goes here</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default FavouritesScreen;