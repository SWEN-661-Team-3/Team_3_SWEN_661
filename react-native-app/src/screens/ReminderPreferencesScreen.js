import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CareHeader from '../components/CareHeader';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

const TOGGLES = [
  { key: 'sound', label: 'Sound Alerts' },
  { key: 'vibration', label: 'Vibration' },
  { key: 'persistent', label: 'Persistent Notifications' },
  { key: 'repeat', label: 'Repeat Until Done' },
  { key: 'caregiverNotify', label: 'Notify Caregiver' },
  { key: 'quietHours', label: 'Quiet Hours (10 PM - 7 AM)' },
];

const TIMINGS = ['on-time', '5-min-early', '15-min-early'];
const TIMING_LABELS = { 'on-time': 'On Time', '5-min-early': '5 Min Early', '15-min-early': '15 Min Early' };

export default function ReminderPreferencesScreen({ navigation }) {
  const { state, updateReminderPrefs } = useAppState();
  const [local, setLocal] = useState({ ...state.reminderPrefs });

  const handleSave = async () => {
    await updateReminderPrefs(local);
    Alert.alert('Saved', 'Reminder preferences updated');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Reminder Preferences"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {TOGGLES.map((t) => (
          <View key={t.key} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t.label}</Text>
            <Switch
              value={local[t.key]}
              onValueChange={(v) => setLocal({ ...local, [t.key]: v })}
              trackColor={{ true: Colors.primaryAction }}
              thumbColor={Colors.white}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Reminder Timing</Text>
        <View style={styles.timingRow}>
          {TIMINGS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.timingChip, local.timing === t && styles.timingChipActive]}
              onPress={() => setLocal({ ...local, timing: t })}
              accessibilityRole="radio"
              accessibilityState={{ selected: local.timing === t }}
            >
              <Text style={[styles.timingText, local.timing === t && styles.timingTextActive]}>
                {TIMING_LABELS[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24 },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  toggleLabel: { fontSize: 18, fontWeight: '700', color: Colors.heading, flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.heading, marginTop: 32, marginBottom: 16 },
  timingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timingChip: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 16, borderWidth: 3, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  timingChipActive: { borderColor: Colors.primaryAction, backgroundColor: Colors.blueBg },
  timingText: { fontSize: 16, fontWeight: '700', color: Colors.heading },
  timingTextActive: { color: Colors.primaryAction },
  saveButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
  },
  saveText: { fontSize: 20, fontWeight: '700', color: Colors.white },
});
