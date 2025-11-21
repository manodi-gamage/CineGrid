import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RemoveButton = ({ onPress, size = 32, iconSize = 16, style }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="close" size={iconSize} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default RemoveButton;
