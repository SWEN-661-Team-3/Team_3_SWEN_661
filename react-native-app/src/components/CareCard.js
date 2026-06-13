import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../theme/colors';

export default function CareCard({
  children,
  borderRadius = 36,
  borderColor = Colors.border,
  backgroundColor = Colors.white,
  padding = 24,
  onTap,
  accessibilityLabel,
}) {
  const containerStyle = [
    styles.container,
    { borderRadius, borderColor, backgroundColor, padding },
  ];

  if (onTap) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onTap}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});
