/**
 * CastCard Component
 * Displays a cast member with profile image, name, and character
 * Used in movie details screen
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getProfileUrl } from '../config/tmdbConfig';
import { getInitials } from '../utils/formatters';

const CastCard = ({ cast }) => {
  const { name, character, profile_path } = cast;
  const profileUrl = profile_path ? getProfileUrl(profile_path, 'w185') : null;

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        {profileUrl ? (
          <Image 
            source={{ uri: profileUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.initials}>{getInitials(name)}</Text>
          </View>
        )}
      </View>
      
      {/* Name and Character */}
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      {character && (
        <>
          <Text style={styles.as}>as</Text>
          <Text style={styles.character} numberOfLines={2}>
            {character}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  as: {
    fontSize: 10,
    color: '#808080',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  character: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
  },
});

export default CastCard;
