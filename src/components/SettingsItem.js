import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Switch } from 'react-native';

const SettingsItem = ({ 
  icon, 
  label, 
  value, 
  onPress, 
  showArrow = true,
  type = 'navigate', // 'navigate', 'toggle', 'text'
  isEnabled = false,
  onToggle,
  danger = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={type === 'toggle'}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, danger && styles.dangerText]}>
          {label}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {type === 'toggle' && (
          <Switch
            value={isEnabled}
            onValueChange={onToggle}
            trackColor={{ false: '#3E3E3E', true: '#007AFF' }}
            thumbColor={isEnabled ? '#FFFFFF' : '#B0B0B0'}
          />
        )}
        
        {type === 'text' && value && (
          <Text style={styles.value}>{value}</Text>
        )}
        
        {showArrow && type === 'navigate' && (
          <Text style={styles.arrow}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  dangerText: {
    color: '#FF3B30',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    color: '#B0B0B0',
    marginRight: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#B0B0B0',
  },
});

export default SettingsItem;
