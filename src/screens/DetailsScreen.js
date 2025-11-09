// src/screens/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Details Screen - Content goes here</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default DetailsScreen;