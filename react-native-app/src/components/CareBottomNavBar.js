import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../theme/colors';

export default function CareBottomNavBar({ onFullPlan, onSettings }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onFullPlan}
        accessibilityRole="button"
        accessibilityLabel="Full Plan"
        disabled={!onFullPlan}
      >
        <Text style={styles.primaryText}>Full Plan</Text>
      </TouchableOpacity>
      <View style={styles.gap} />
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onSettings}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        disabled={!onSettings}
      >
        <Text style={styles.secondaryText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 4,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primaryAction,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryAction,
  },
  gap: { width: 12 },
  primaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  secondaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryAction,
  },
});
