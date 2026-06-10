import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import CareCard from '../components/CareCard';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

export default function ReminderDetailScreen({ navigation }) {
  const { state, dismissReminder } = useAppState();
  const reminder = state.reminders.length > 0 ? state.reminders[0] : null;

  const handleComplete = () => {
    if (reminder) dismissReminder(reminder.id);
    navigation.navigate('ReminderSuccess');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Reminder Details"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CareCard borderRadius={24}>
          <Text style={styles.title}>{reminder?.title || 'Medication Reminder'}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time" size={20} color={Colors.mutedText} />
            <Text style={styles.timeText}>{reminder?.dueTime || '9:00 AM Today'}</Text>
          </View>
        </CareCard>

        {reminder?.instructions && (
          <View style={styles.instrSection}>
            <View style={styles.instrHeader}>
              <Ionicons name="document-text" size={20} color={Colors.primaryAction} />
              <Text style={styles.instrTitle}>Instructions</Text>
            </View>
            <CareCard borderRadius={20}>
              <Text style={styles.instrBody}>{reminder.instructions}</Text>
            </CareCard>
          </View>
        )}

        {reminder?.relatedAppointment && (
          <View style={styles.relatedSection}>
            <CareCard borderRadius={20} backgroundColor={Colors.blueBg} borderColor={Colors.blueLight}>
              <Text style={styles.relatedLabel}>Related Appointment</Text>
              <Text style={styles.relatedTitle}>{reminder.relatedAppointment}</Text>
              <Text style={styles.relatedTime}>{reminder.relatedAppointmentTime}</Text>
            </CareCard>
          </View>
        )}

        <View style={{ height: 32 }} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
          <Text style={styles.primaryText}>Mark Complete</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SnoozeOptions')}
        >
          <Ionicons name="time" size={24} color={Colors.primaryAction} />
          <Text style={styles.secondaryText}>Snooze Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24 },
  title: { fontSize: 24, fontWeight: '900', color: Colors.heading },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  timeText: { fontSize: 18, fontWeight: '500', color: Colors.mutedText, flex: 1 },
  instrSection: { marginTop: 24 },
  instrHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  instrTitle: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  instrBody: { fontSize: 16, color: Colors.heading, lineHeight: 24 },
  relatedSection: { marginTop: 24 },
  relatedLabel: { fontSize: 14, fontWeight: '700', letterSpacing: 1, color: Colors.primaryAction, textTransform: 'uppercase' },
  relatedTitle: { fontSize: 18, fontWeight: '700', color: Colors.heading, marginTop: 4 },
  relatedTime: { fontSize: 16, color: Colors.mutedText, marginTop: 2 },
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
