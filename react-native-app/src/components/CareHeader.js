import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function CareHeader({ title, subtitle, onBack, onEmergency }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={28} color={Colors.heading} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        {onEmergency && (
          <TouchableOpacity
            onPress={onEmergency}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Emergency help"
          >
            <Ionicons name="warning" size={24} color={Colors.emergency} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    backgroundColor: Colors.white,
    borderBottomWidth: 4,
    borderBottomColor: Colors.border,
    justifyContent: 'flex-end',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.heading,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.mutedText,
  },
});
