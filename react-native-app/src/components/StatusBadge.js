import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const BADGE_CONFIG = {
  done: { label: 'Done', icon: 'checkmark-circle', fg: Colors.success, bg: Colors.successBg },
  missed: { label: 'Missed', icon: 'close-circle', fg: Colors.emergency, bg: Colors.emergencyBg },
  sent: { label: 'Sent', icon: 'arrow-up-circle', fg: Colors.primaryAction, bg: Colors.blueBg },
  todo: { label: 'To Do', icon: 'ellipse-outline', fg: Colors.mutedText, bg: Colors.subtleBg },
};

export default function StatusBadge({ type }) {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.todo;

  return (
    <View
      style={[styles.container, { backgroundColor: config.bg }]}
      accessibilityLabel={`Status: ${config.label}`}
    >
      <Ionicons name={config.icon} size={16} color={config.fg} />
      <Text style={[styles.label, { color: config.fg }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
