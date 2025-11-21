/**
 * Onboarding Screen Component
 * 
 * Multi-slide onboarding flow for first-time users
 * Features:
 * - 5 informative slides
 * - Swipeable FlatList
 * - Pagination dots
 * - Skip and Next buttons
 * - Smooth animations
 * - Gradient background orbs
 */

import React, { useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import OnboardingSlide from '../components/OnboardingSlide';
import PaginationDots from '../components/PaginationDots';
import OnboardingButton from '../components/OnboardingButton';
import { setOnboardingComplete } from '../utils/onboardingStorage';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to CineGRID',
    subtitle: 'Your Personal Movie Companion',
    description: 'Discover, track, and manage your favorite movies all in one place',
    icon: '🎬',
    color: '#FF6B6B',
  },
  {
    id: '2',
    title: 'Discover Amazing Movies',
    subtitle: 'Explore Trending & Popular',
    description: 'Browse through thousands of movies, from classics to the latest releases',
    icon: '🎥',
    color: '#4ECDC4',
  },
  {
    id: '3',
    title: 'Create Your Watchlist',
    subtitle: 'Never Forget What to Watch',
    description: 'Save your favorite movies and build your personal collection',
    icon: '❤️',
    color: '#FFE66D',
  },
  {
    id: '4',
    title: 'Filter by Genre',
    subtitle: 'Find What You Love',
    description: 'Browse by Action, Horror, Comedy, Drama, and more',
    icon: '🎭',
    color: '#95E1D3',
  },
  {
    id: '5',
    title: 'Ready to Begin?',
    subtitle: 'Your Movie Journey Starts Here',
    description: 'Sign up now and start exploring the world of cinema',
    icon: '🍿',
    color: '#007AFF',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await setOnboardingComplete();
    navigation.replace('Login');
  };

  const handleGetStarted = async () => {
    await setOnboardingComplete();
    navigation.replace('Login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Gradient Background Orbs - Using SVG for true radial gradients */}
      <View style={styles.backgroundGradients} pointerEvents="none">
        {/* Pink Orb - Top Left */}
        <Svg style={styles.gradientOrb1} viewBox="0 0 300 300">
          <Defs>
            <RadialGradient id="pinkGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgb(255, 53, 184)" stopOpacity="0.8" />
              <Stop offset="40%" stopColor="rgb(255, 53, 184)" stopOpacity="0.4" />
              <Stop offset="70%" stopColor="rgb(255, 53, 184)" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="rgb(255, 53, 184)" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="150" cy="150" r="150" fill="url(#pinkGradient)" />
        </Svg>

        {/* Cyan Orb - Bottom Right */}
        <Svg style={styles.gradientOrb2} viewBox="0 0 400 400">
          <Defs>
            <RadialGradient id="cyanGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgb(0, 250, 254)" stopOpacity="0.8" />
              <Stop offset="40%" stopColor="rgb(0, 250, 254)" stopOpacity="0.4" />
              <Stop offset="70%" stopColor="rgb(0, 250, 254)" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="rgb(0, 250, 254)" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="200" cy="200" r="200" fill="url(#cyanGradient)" />
        </Svg>

        {/* Green Orb - Middle */}
        <Svg style={styles.gradientOrb3} viewBox="0 0 350 350">
          <Defs>
            <RadialGradient id="greenGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgb(56, 239, 125)" stopOpacity="0.6" />
              <Stop offset="40%" stopColor="rgb(56, 239, 125)" stopOpacity="0.3" />
              <Stop offset="70%" stopColor="rgb(56, 239, 125)" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="rgb(56, 239, 125)" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="175" cy="175" r="175" fill="url(#greenGradient)" />
        </Svg>
      </View>

      {/* Skip Button */}
      {!isLastSlide && (
        <OnboardingButton
          title="Skip"
          onPress={handleSkip}
          style={styles.skipButton}
          textStyle={styles.skipText}
        />
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => <OnboardingSlide slide={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        bounces={false}
      />

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <PaginationDots
          slides={slides}
          currentIndex={currentIndex}
        />

        {/* Action Button */}
        <OnboardingButton
          title={isLastSlide ? 'Get Started' : 'Next'}
          onPress={isLastSlide ? handleGetStarted : handleNext}
          style={styles.actionButton}
        />
      </View>
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
    width: 600,
    height: 600,
    top: -100,
    left: -150,
  },
  gradientOrb2: {
    position: 'absolute',
    width: 600,
    height: 600,
    bottom: -150,
    right: -250,
  },
  gradientOrb3: {
    position: 'absolute',
    width: 500,
    height: 500,
    top: '40%',
    left: '20%',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  actionButton: {
    marginTop: 20,
  },
});

export default OnboardingScreen;