import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AboutSection = () => {
  return (
    <View style={styles.container}>
      {/* App Icon/Logo */}
      <Image
        source={require('../../assets/app-icon.png')}
        style={styles.appIcon}
      />
      
      <Text style={styles.appName}>CineGRID</Text>
      <Text style={styles.tagline}>Your Personal Movie Companion</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      
      <Text style={styles.copyright}>
        © 2024 CineGRID. All rights reserved.
      </Text>
      
      <Text style={styles.credits}>
        Powered by TMDb API
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginVertical: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: '#808080',
    marginBottom: 16,
  },
  copyright: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 4,
  },
  credits: {
    fontSize: 11,
    color: '#666666',
  },
});

export default AboutSection;
