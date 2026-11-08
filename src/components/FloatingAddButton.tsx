import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';

interface FloatingAddButtonProps {
  onPress: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.accent }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel="Create Note"
    >
      <Ionicons name="add" size={32} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 99,
  },
});
