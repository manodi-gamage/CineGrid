// src/screens/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Watch movies in\nVirtual Reality',
    description: 'Download and watch offline\nwherever you are',
    image: require('../../assets/onboarding.png'),
  },
  // Add more onboarding screens here
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={[colors.pink, colors.cyan, colors.green]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientRing}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background Orbs - Using SVG for true radial gradients */}
      <View style={styles.backgroundGradients}>
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
        <Svg style={styles.gradientOrb3} viewBox="0 0 400 400">
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
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.pink, colors.cyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradientBorder}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>
                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Sign up'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
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
    top: -10,
    left: -150,
  },
  gradientOrb3: {
    position: 'absolute',
    width: 600,
    height: 600,
    bottom: 50,
    right: -250,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    marginBottom: 60,
  },
  gradientRing: {
    width: 320,
    height: 320,
    borderRadius: 160,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 314,
    height: 314,
    borderRadius: 157,
    overflow: 'hidden',
    backgroundColor: colors.dark,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  image: {
    width: '120%',
    height: '120%',
    marginLeft: 10,
    marginBottom: -70,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 80,
    paddingHorizontal: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.cyan,
    width: 24,
  },
  buttonGradientBorder: {
    borderRadius: 25,
    padding: 2,
  },
  buttonInner: {
    backgroundColor: colors.background,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen;