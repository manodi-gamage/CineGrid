/**
 * SearchBar Component
 * 
 * Search input with icon, clear button, and loading indicator
 * Auto-focuses on mount for immediate user interaction
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const SearchBar = ({ 
  value, 
  onChangeText, 
  onClear, 
  loading = false,
  autoFocus = true,
  placeholder = "Search movies...",
  onSubmit,
}) => {
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <Ionicons 
        name="search" 
        size={20} 
        color={colors.textSecondary} 
        style={styles.searchIcon}
      />

      {/* Text Input */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Loading Indicator or Clear Button */}
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={colors.cyan} 
          style={styles.rightIcon}
        />
      ) : value ? (
        <TouchableOpacity 
          onPress={onClear}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    paddingVertical: 0, // Remove default padding
  },
  rightIcon: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SearchBar;
