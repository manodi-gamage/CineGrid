import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileHeader = ({ user, onEditPress }) => {
  // Handle null user (during logout)
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Profile Image with Camera Icon */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: user.image || 'https://via.placeholder.com/120' }}
          style={styles.profileImage}
        />
        <TouchableOpacity 
          style={styles.cameraIconContainer}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* User Info */}
      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>
      <Text style={styles.username}>@{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      
      {/* Member Since */}
      <Text style={styles.memberSince}>
        Member since {new Date().getFullYear()}
      </Text>
      
      {/* Edit Button */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={onEditPress}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1E1E1E',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileHeader;
