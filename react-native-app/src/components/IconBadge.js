import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function IconBadge({
  icon,
  color,
  size = 28,
  padding = 12,
  borderRadius = 16,
}) {
  return (
    <View
      style={{
        padding,
        borderRadius,
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Ionicons name={icon} size={size} color={Colors.white} />
    </View>
  );
}
