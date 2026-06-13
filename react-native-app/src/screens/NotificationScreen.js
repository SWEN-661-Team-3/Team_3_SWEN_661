import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareCard from '../components/CareCard';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

export default function NotificationScreen({ navigation, route }) {
  const { state, dismissReminder } = useAppState();
  const reminderId = route?.params?.reminderId;
  const reminder = reminderId
    ? state.reminders.find((r) => r.id === reminderId) || state.reminders[0]
    : state.reminders[0];

  const handleDismiss = () => {
    if (reminder) dismissReminder(reminder.id);
    navigation.navigate('ReminderSuccess');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications" size={48} color={Colors.warningDark} />
          </View>
          <Text style={styles.heading}>Reminder</Text>
          <Text style={styles.title}>{reminder?.title || 'Medication Reminder'}</Text>
          <Text style={styles.time}>{reminder?.dueTime || '12:30 PM'}</Text>
        </View>

        {reminder?.instructions && (
          <CareCard borderRadius={24}>
            <View style={styles.instrHeader}>
              <Ionicons name="information-circle" size={20} color={Colors.warningDark} />
              <Text style={styles.instrTitle}>Instructions</Text>
            </View>
            <Text style={styles.instrBody}>{reminder.instructions}</Text>
          </CareCard>
        )}

        <View style={{ height: 32 }} />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ReminderDetail', { reminderId: reminder?.id })}
        >
          <Ionicons name="eye" size={24} color={Colors.white} />
          <Text style={styles.primaryText}>View Details</Text>
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
        <TouchableOpacity style={styles.doneButton} onPress={handleDismiss}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <Text style={styles.doneText}>Mark Done</Text>
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
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.warningBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heading: { fontSize: 16, fontWeight: '700', letterSpacing: 2, color: Colors.mutedText, textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '900', color: Colors.heading, textAlign: 'center', marginTop: 8 },
  time: { fontSize: 20, fontWeight: '700', color: Colors.mutedText, marginTop: 4 },
  instrHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  instrTitle: { fontSize: 16, fontWeight: '700', color: Colors.warningDark },
  instrBody: { fontSize: 16, color: Colors.heading, lineHeight: 24 },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: Colors.primaryAction, borderRadius: 20, paddingVertical: 18, paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  primaryText: { fontSize: 20, fontWeight: '700', color: Colors.white, flexShrink: 1 },
  secondaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 20, paddingVertical: 18, paddingHorizontal: 16,
    borderWidth: 3, borderColor: Colors.primaryAction, flexWrap: 'wrap',
  },
  secondaryText: { fontSize: 20, fontWeight: '700', color: Colors.primaryAction, flexShrink: 1 },
  doneButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: Colors.successBg, borderRadius: 20, paddingVertical: 18, paddingHorizontal: 16,
    borderWidth: 3, borderColor: Colors.success, flexWrap: 'wrap',
  },
  doneText: { fontSize: 20, fontWeight: '700', color: Colors.success, flexShrink: 1 },
});
