/**
 * TrailerCard Component
 * Displays a video trailer with thumbnail and play button
 * Opens YouTube video when tapped
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';

const TrailerCard = ({ video }) => {
  const { key, name, type, site } = video;
  
  // Only support YouTube videos
  if (site !== 'YouTube') {
    return null;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${key}`;

  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(videoUrl);
      
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert('Error', 'Cannot open YouTube video');
      }
    } catch (error) {
      console.error('Error opening video:', error);
      Alert.alert('Error', 'Failed to open video');
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: thumbnailUrl }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        {/* Play Button Overlay */}
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        
        {/* Type Badge */}
        {type && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{type}</Text>
          </View>
        )}
      </View>
      
      {/* Video Title */}
      <Text style={styles.title} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    marginRight: 12,
  },
  thumbnailContainer: {
    width: 200,
    height: 112,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 4,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    lineHeight: 18,
  },
});

export default TrailerCard;
