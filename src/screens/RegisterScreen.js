// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors } from '../utils/colors';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Add your registration logic here
    console.log('Register:', fullName, email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Neon Background Orbs */}
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
      </View>

      {/* Header at top */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Footer at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.8}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={[colors.pink, colors.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradientBorder}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerLinks}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  gradientOrb2: {
    position: 'absolute',
    width: 600,
    height: 600,
    bottom: 50,
    right: -250,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 12,
    backgroundColor: colors.dark,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.white,
  },
  footer: {
    marginTop: 32,
  },
  buttonContainer: {
    marginBottom: 24,
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
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signInText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;