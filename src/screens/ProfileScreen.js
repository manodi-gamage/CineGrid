// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { useAuth } from '../features/auth/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Logging out...');
              await logout();
              console.log('Logout successful, navigating to Login...');
              
              // Get the root navigator and reset to Login
              const rootNavigation = navigation.getParent();
              if (rootNavigation) {
                rootNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              } else {
                // Fallback: try direct navigation
                navigation.navigate('Login');
              }
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Neon Background Orbs */}
      <View style={styles.backgroundGradients} pointerEvents="none">
        {/* Pink Orb - Top */}
        <Svg style={styles.gradientOrb1} viewBox="0 0 300 300">
          <Defs>
            <RadialGradient id="pinkGradientProfile" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgb(255, 53, 184)" stopOpacity="0.6" />
              <Stop offset="40%" stopColor="rgb(255, 53, 184)" stopOpacity="0.3" />
              <Stop offset="70%" stopColor="rgb(255, 53, 184)" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="rgb(255, 53, 184)" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="150" cy="150" r="150" fill="url(#pinkGradientProfile)" />
        </Svg>

        {/* Cyan Orb - Bottom */}
        <Svg style={styles.gradientOrb2} viewBox="0 0 400 400">
          <Defs>
            <RadialGradient id="cyanGradientProfile" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgb(0, 250, 254)" stopOpacity="0.6" />
              <Stop offset="40%" stopColor="rgb(0, 250, 254)" stopOpacity="0.3" />
              <Stop offset="70%" stopColor="rgb(0, 250, 254)" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="rgb(0, 250, 254)" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="200" cy="200" r="200" fill="url(#cyanGradientProfile)" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <LinearGradient
              colors={[colors.pink, colors.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageGradientBorder}
            >
              <Image
                source={{
                  uri: user?.image || 'https://ui-avatars.com/api/?name=' + 
                    encodeURIComponent(user?.firstName + ' ' + user?.lastName) + 
                    '&size=128&background=random',
                }}
                style={styles.profileImage}
                defaultSource={require('../../assets/icon.png')}
              />
            </LinearGradient>
          </View>
          <Text style={styles.name}>
            {user?.firstName || ''} {user?.lastName || ''}
          </Text>
          <Text style={styles.username}>@{user?.username || 'user'}</Text>
        </View>

        {/* Profile Info Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{user?.id || 'N/A'}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => {
            console.log('Logout button pressed!');
            handleLogout();
          }}
          activeOpacity={0.8}
          style={styles.logoutButtonContainer}
        >
          <View style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradients: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientOrb1: {
    position: 'absolute',
    width: 500,
    height: 500,
    top: -100,
    right: -100,
  },
  gradientOrb2: {
    position: 'absolute',
    width: 500,
    height: 500,
    bottom: -150,
    left: -150,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageGradientBorder: {
    borderRadius: 64,
    padding: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.background,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoContainer: {
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
  },
  logoutButtonContainer: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: colors.pink,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfileScreen;