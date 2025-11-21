// src/screens/LoginScreen.js
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { useAuth } from '../features/auth/AuthContext';
import { loginValidationSchema, validateField } from '../features/auth/validation';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  /**
   * Validate field on blur
   */
  const handleFieldBlur = async (fieldName, value) => {
    const error = await validateField(loginValidationSchema, fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    console.log('Login button clicked');
    try {
      // Clear previous errors
      setErrors({});
      
      console.log('Validating form with:', { username, password });
      
      // Validate form
      await loginValidationSchema.validate(
        { username, password },
        { abortEarly: false }
      );

      console.log('Validation passed, attempting login...');
      setIsLoading(true);

      // Attempt login
      const result = await login(username, password);
      console.log('Login successful:', result);

      // Navigate to main app and clear the navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);

      if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        console.log('Validation errors:', validationErrors);
        setErrors(validationErrors);
      } else {
        // Handle API errors
        Alert.alert(
          'Login Failed',
          error.message || 'Invalid username or password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  /**
   * Fill form with test credentials
   */
  const useTestCredentials = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setErrors({});
    Alert.alert(
      'Test Credentials Loaded',
      'You can now tap "Sign In" to login with test credentials.',
      [{ text: 'OK' }]
    );
  };

  // DEBUG FUNCTION - Remove before production
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@cinegrid_has_launched');
      Alert.alert(
        'Onboarding Reset',
        'The onboarding has been reset. Please close and restart the app to see the onboarding screen again.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      Alert.alert('Error', 'Failed to reset onboarding');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Neon Background Orbs */}
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
      </View>

      {/* Header at top */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* DEBUG BUTTON - Remove before production */}
        <TouchableOpacity
          onPress={resetOnboarding}
          style={styles.debugButton}
          activeOpacity={0.7}
        >
          <Text style={styles.debugButtonText}>🔧 Reset Onboarding (Debug)</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={[
              styles.inputWrapper,
              errors.username && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor={colors.textSecondary}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors((prev) => ({ ...prev, username: null }));
                  }
                }}
                onBlur={() => handleFieldBlur('username', username)}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputWrapper,
              errors.password && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
                onBlur={() => handleFieldBlur('password', password)}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Test Credentials Button */}
          <TouchableOpacity
            onPress={useTestCredentials}
            style={styles.testCredentialsButton}
            disabled={isLoading}
          >
            <Text style={styles.testCredentialsText}>
              📝 Use Test Credentials
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.8}
            style={styles.buttonContainer}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[colors.pink, colors.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradientBorder}
            >
              <View style={styles.buttonInner}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerLinks}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
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
  // DEBUG BUTTON STYLES - Remove before production
  debugButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 999,
  },
  debugButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  // END DEBUG STYLES
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
  forgotPassword: {
    color: colors.cyan,
    fontSize: 14,
    textAlign: 'right',
  },
  testCredentialsButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 250, 254, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cyan,
    alignItems: 'center',
  },
  testCredentialsText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '500',
  },
  inputError: {
    borderColor: colors.pink,
    borderWidth: 1.5,
  },
  errorText: {
    color: colors.pink,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
  signUpText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;