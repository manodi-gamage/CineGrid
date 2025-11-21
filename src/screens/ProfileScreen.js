// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors } from '../utils/colors';
import { useAuth } from '../features/auth/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import ProfileHeader from '../components/ProfileHeader';
import StatCard from '../components/StatCard';
import SettingsItem from '../components/SettingsItem';
import AboutSection from '../components/AboutSection';
import { APP_INFO } from '../utils/appInfo';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled] = useState(true); // Always enabled

  // Calculate statistics
  const favoritesCount = favorites?.length || 0;
  const stats = {
    favorites: favoritesCount,
    watched: 156, // Placeholder
    watchlist: 12, // Placeholder
    reviews: 0,   // Placeholder
  };

  // Show coming soon alert for placeholder features
  const showComingSoon = (feature) => {
    Alert.alert(
      'Coming Soon',
      `${feature} will be available in a future update.`,
      [{ text: 'OK' }]
    );
  };

  // Handle logout with confirmation
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
              await logout();
              // Navigation handled automatically by AuthContext
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Handle delete account with warning
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            showComingSoon('Account deletion');
          },
        },
      ]
    );
  };

  // Section Header Component
  const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader 
          user={user} 
          onEditPress={() => showComingSoon('Edit Profile')}
        />

        {/* Statistics Section */}
        <SectionHeader title="Statistics" />
        <View style={styles.statsGrid}>
          <StatCard 
            icon="❤️" 
            label="Favorites" 
            value={stats.favorites} 
            color="#FF6B6B" 
          />
          <StatCard 
            icon="🎬" 
            label="Watched" 
            value={stats.watched} 
            color="#4ECDC4" 
          />
          <StatCard 
            icon="📝" 
            label="Reviews" 
            value={stats.reviews} 
            color="#95E1D3" 
          />
          <StatCard 
            icon="⭐" 
            label="Watchlist" 
            value={stats.watchlist} 
            color="#FFE66D" 
          />
        </View>

        {/* Preferences Section */}
        <SectionHeader title="Preferences" />
        <View style={styles.section}>
          <SettingsItem
            icon="🔔"
            label="Notifications"
            type="toggle"
            isEnabled={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
          <SettingsItem
            icon="🌙"
            label="Dark Mode"
            type="toggle"
            isEnabled={darkModeEnabled}
            onToggle={() => showComingSoon('Dark mode toggle')}
          />
          <SettingsItem
            icon="🌍"
            label="Language"
            type="text"
            value="English"
            onPress={() => showComingSoon('Language settings')}
          />
          <SettingsItem
            icon="🎬"
            label="Default View"
            type="text"
            value="Grid"
            onPress={() => showComingSoon('View settings')}
          />
        </View>

        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <SettingsItem
            icon="👤"
            label="Edit Profile"
            onPress={() => showComingSoon('Edit Profile')}
          />
          <SettingsItem
            icon="🔒"
            label="Change Password"
            onPress={() => showComingSoon('Change Password')}
          />
          <SettingsItem
            icon="📧"
            label="Email Preferences"
            onPress={() => showComingSoon('Email Preferences')}
          />
          <SettingsItem
            icon="🔐"
            label="Privacy Settings"
            onPress={() => showComingSoon('Privacy Settings')}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="About" />
        <View style={styles.section}>
          <SettingsItem
            icon="ℹ️"
            label="About CineGRID"
            onPress={() => showComingSoon('About CineGRID')}
          />
          <SettingsItem
            icon="📱"
            label="App Version"
            type="text"
            value={APP_INFO.version}
            showArrow={false}
            onPress={() => {}}
          />
          <SettingsItem
            icon="📄"
            label="Terms of Service"
            onPress={() => showComingSoon('Terms of Service')}
          />
          <SettingsItem
            icon="🔒"
            label="Privacy Policy"
            onPress={() => showComingSoon('Privacy Policy')}
          />
          <SettingsItem
            icon="⭐"
            label="Rate App"
            onPress={() => showComingSoon('Rate App')}
          />
          <SettingsItem
            icon="📮"
            label="Contact Support"
            onPress={() => showComingSoon('Contact Support')}
          />
        </View>

        {/* About Section Component */}
        <AboutSection />

        {/* Danger Zone */}
        <SectionHeader title="Danger Zone" />
        <View style={styles.section}>
          <SettingsItem
            icon="🚪"
            label="Logout"
            onPress={handleLogout}
            showArrow={false}
          />
          <SettingsItem
            icon="🗑️"
            label="Delete Account"
            danger={true}
            onPress={handleDeleteAccount}
            showArrow={false}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
  },
});

export default ProfileScreen;