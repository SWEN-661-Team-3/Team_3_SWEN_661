import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function MissedReminderScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="alert-circle" size={48} color={Colors.emergency} />
          </View>
          <Text style={styles.heading}>Missed Reminder</Text>
          <Text style={styles.title}>Afternoon Medication</Text>
          <Text style={styles.time}>Was due at 12:30 PM</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ReminderSuccess')}
        >
          <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
          <Text style={styles.primaryText}>Complete Now</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SnoozeOptions')}
        >
          <Ionicons name="time" size={24} color={Colors.primaryAction} />
          <Text style={styles.secondaryText}>Snooze</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('CaregiverHelp')}
        >
          <Ionicons name="people" size={24} color={Colors.primaryAction} />
          <Text style={styles.secondaryText}>Ask for Help</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24, flexGrow: 1 },
  header: { alignItems: 'center', marginTop: 32, marginBottom: 32 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.emergencyBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heading: { fontSize: 16, fontWeight: '700', letterSpacing: 2, color: Colors.emergency, textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '900', color: Colors.heading, textAlign: 'center', marginTop: 8 },
  time: { fontSize: 18, fontWeight: '500', color: Colors.mutedText, marginTop: 4 },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: Colors.primaryAction, borderRadius: 20, paddingVertical: 18,
  },
  primaryText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  secondaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 20, paddingVertical: 18,
    borderWidth: 3, borderColor: Colors.primaryAction,
  },
  secondaryText: { fontSize: 20, fontWeight: '700', color: Colors.primaryAction },
});
