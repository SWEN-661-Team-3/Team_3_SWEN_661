import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import CareCard from '../components/CareCard';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

export default function DetailsScreen({ navigation, route }) {
  const { state, completeTask } = useAppState();
  const id = route.params?.id;

  let appointment;
  if (id) {
    appointment = state.todaysPlan.find((a) => a.id === id);
  }
  if (!appointment) {
    appointment = state.todaysPlan.find((a) => a.status !== 'done') || state.todaysPlan[0];
  }

  const handleComplete = () => {
    completeTask(appointment.id);
    navigation.navigate('Success', { type: 'complete', title: appointment.title });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Item Details"
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CareCard borderRadius={32}>
          <View style={styles.typeRow}>
            <View style={styles.typeIcon}>
              <Ionicons name="medical" size={24} color={Colors.primaryAction} />
            </View>
            <Text style={styles.typeLabel}>{appointment.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.apptTitle}>{appointment.title}</Text>
          <Text style={styles.apptTime}>{appointment.time} - {appointment.date}</Text>
          {appointment.location !== '' && (
            <View style={styles.locRow}>
              <Ionicons name="location" size={20} color={Colors.mutedText} />
              <Text style={styles.locText}>{appointment.location}</Text>
            </View>
          )}
        </CareCard>

        {appointment.notes !== '' && (
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Ionicons name="document-text" size={32} color={Colors.primaryAction} />
              <Text style={styles.notesTitle}>Important Notes</Text>
            </View>
            <CareCard borderRadius={24}>
              <Text style={styles.notesBody}>{appointment.notes}</Text>
            </CareCard>
          </View>
        )}

        <View style={{ height: 32 }} />
        <View style={styles.infoRow}>
          <InfoCard icon="notifications" iconColor={Colors.warning} title="Reminders" subtitle="30 min before" />
          <View style={{ width: 12 }} />
          <InfoCard icon="eye" iconColor={Colors.caregiver} title="Visibility" subtitle="Shared with Sarah" />
        </View>

        <View style={{ height: 32 }} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
          <Text style={styles.primaryText}>Mark Complete</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Success', { type: 'snooze', title: appointment.title })}
        >
          <Ionicons name="time" size={24} color={Colors.primaryAction} />
          <Text style={styles.secondaryText}>Snooze for 1 Hour</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => Alert.alert('Edit', 'Edit functionality coming soon')}
        >
          <Ionicons name="create" size={24} color={Colors.primaryAction} />
          <Text style={styles.secondaryText}>Edit Details</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('CaregiverHelp')}
        >
          <Ionicons name="people" size={24} color={Colors.primaryAction} />
          <Text style={styles.secondaryText}>Ask Caregiver</Text>
        </TouchableOpacity>
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({ icon, iconColor, title, subtitle }) {
  return (
    <View style={infoStyles.card}>
      <View style={infoStyles.header}>
        <Ionicons name={icon} size={28} color={iconColor} />
        <Text style={infoStyles.title}>{title}</Text>
      </View>
      <Text style={infoStyles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 24,
    borderWidth: 4, borderColor: Colors.border, padding: 24,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '900', color: Colors.heading, flex: 1 },
  subtitle: { fontSize: 16, color: Colors.mutedText },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24 },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  typeIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.blueBg,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  typeLabel: { fontSize: 14, fontWeight: '700', letterSpacing: 1.5, color: Colors.mutedText },
  apptTitle: { fontSize: 28, fontWeight: '900', color: Colors.heading },
  apptTime: { fontSize: 18, fontWeight: '500', color: Colors.mutedText, marginTop: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  locText: { fontSize: 16, color: Colors.mutedText, flex: 1 },
  notesSection: { marginTop: 32 },
  notesHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  notesTitle: { fontSize: 28, fontWeight: '900', color: Colors.heading, flex: 1 },
  notesBody: { fontSize: 18, color: Colors.heading, lineHeight: 28 },
  infoRow: { flexDirection: 'row' },
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
