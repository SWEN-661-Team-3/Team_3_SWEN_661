import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

const DURATIONS = ['5 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours'];

export default function SnoozeOptionsScreen({ navigation }) {
  const { state, snoozeReminder } = useAppState();
  const [selected, setSelected] = useState('15 minutes');
  const reminder = state.reminders.length > 0 ? state.reminders[0] : null;

  const handleSnooze = () => {
    if (reminder) snoozeReminder(reminder.id);
    navigation.navigate('Success', { type: 'snooze', title: 'Medication' });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader title="Snooze Reminder" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>How long would you like to snooze?</Text>
        {DURATIONS.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.option, selected === d && styles.optionSelected]}
            onPress={() => setSelected(d)}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === d }}
          >
            <Ionicons
              name={selected === d ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={selected === d ? Colors.primaryAction : Colors.disabledText}
            />
            <Text style={[styles.optionText, selected === d && styles.optionTextSelected]}>{d}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleSnooze}>
          <Text style={styles.primaryText}>Snooze Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24 },
  heading: { fontSize: 22, fontWeight: '900', color: Colors.heading, marginBottom: 24 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 20, borderRadius: 20, marginBottom: 12,
    backgroundColor: Colors.white, borderWidth: 3, borderColor: Colors.border,
  },
  optionSelected: { borderColor: Colors.primaryAction, backgroundColor: Colors.blueBg },
  optionText: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  optionTextSelected: { color: Colors.primaryAction },
  primaryButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
  },
  primaryText: { fontSize: 20, fontWeight: '700', color: Colors.white },
});
