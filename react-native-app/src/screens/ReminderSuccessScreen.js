import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareCard from '../components/CareCard';
import Colors from '../theme/colors';

export default function ReminderSuccessScreen({ navigation }) {
  const completedAt = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
        </View>
        <Text style={styles.heading}>Reminder Complete!</Text>
        <Text style={styles.body}>Great job keeping up with your health routine.</Text>

        <CareCard borderRadius={24}>
          <InfoRow label="Task" value="Medication Reminder" />
          <View style={styles.divider} />
          <InfoRow label="Completed At" value={completedAt} />
          <View style={styles.divider} />
          <InfoRow label="Status" value="Done" />
        </CareCard>

        <View style={{ height: 32 }} />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'TodaysPlan' }] })}
        >
          <Text style={styles.primaryText}>Return to Today's Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.successBg,
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 24,
  },
  heading: { fontSize: 30, fontWeight: '900', color: Colors.heading, textAlign: 'center' },
  body: { fontSize: 18, color: Colors.mutedText, textAlign: 'center', marginTop: 8, marginBottom: 32 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 16, fontWeight: '700', color: Colors.mutedText, flex: 1 },
  infoValue: { fontSize: 16, fontWeight: '700', color: Colors.heading, flex: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  primaryButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
  },
  primaryText: { fontSize: 20, fontWeight: '700', color: Colors.white },
});
