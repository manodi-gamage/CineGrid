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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors } from '../utils/colors';
import { register } from '../features/auth/authService';
import { registrationValidationSchema, validateField } from '../features/auth/validation';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validate field on blur
   */
  const handleFieldBlur = async (fieldName, value) => {
    const error = await validateField(registrationValidationSchema, fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  /**
   * Handle registration form submission
   */
  const handleRegister = async () => {
    try {
      // Clear previous errors
      setErrors({});
      
      // Validate form
      await registrationValidationSchema.validate(
        { firstName, lastName, username, email, password, confirmPassword },
        { abortEarly: false }
      );

      setIsLoading(true);

      // Attempt registration (simulated with DummyJSON)
      await register({
        firstName,
        lastName,
        username,
        email,
        password,
      });

      setIsLoading(false);

      // Show success message
      Alert.alert(
        'Registration Successful!',
        'This is a demo app using DummyJSON API. Your account has been simulated but not persisted.\n\nPlease use these test credentials to login:\n\nUsername: emilys\nPassword: emilyspass',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);

      if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        // Handle API errors
        Alert.alert(
          'Registration Failed',
          error.message || 'Unable to create account. Please try again.',
          [{ text: 'OK' }]
        );
      }
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Demo Notice */}
        <View style={styles.demoNotice}>
          <Text style={styles.demoText}>
            📝 Demo Registration - Use test credentials to login after signup
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <View style={[
              styles.inputWrapper,
              errors.firstName && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                placeholderTextColor={colors.textSecondary}
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName) {
                    setErrors((prev) => ({ ...prev, firstName: null }));
                  }
                }}
                onBlur={() => handleFieldBlur('firstName', firstName)}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <View style={[
              styles.inputWrapper,
              errors.lastName && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                placeholderTextColor={colors.textSecondary}
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName) {
                    setErrors((prev) => ({ ...prev, lastName: null }));
                  }
                }}
                onBlur={() => handleFieldBlur('lastName', lastName)}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={[
              styles.inputWrapper,
              errors.username && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
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
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputWrapper,
              errors.email && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: null }));
                  }
                }}
                onBlur={() => handleFieldBlur('email', email)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
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
                placeholder="Create a password"
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[
              styles.inputWrapper,
              errors.confirmPassword && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: null }));
                  }
                }}
                onBlur={() => handleFieldBlur('confirmPassword', confirmPassword)}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>
        </View>

        {/* Footer at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleRegister}
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
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerLinks}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
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
  demoNotice: {
    backgroundColor: 'rgba(0, 250, 254, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cyan,
    padding: 12,
    marginBottom: 20,
  },
  demoText: {
    color: colors.cyan,
    fontSize: 12,
    textAlign: 'center',
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
  signInText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;