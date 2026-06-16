import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import CareCard from '../components/CareCard';
import StatusBadge from '../components/StatusBadge';
import Colors from '../theme/colors';

const ENTRIES_TODAY = [
  { title: 'Blood Pressure Medicine', time: '9:00 AM', type: 'medication', status: 'done' },
  { title: 'Heart Clinic Follow-up', time: '10:30 AM', type: 'appointment', status: 'done' },
  { title: 'Emergency Help Request', time: '2:15 PM', type: 'alert', status: 'sent' },
  { title: 'Vitamin D Supplement', time: '6:00 PM', type: 'medication', status: 'missed' },
];

const ENTRIES_YESTERDAY = [
  { title: 'Blood Pressure Medicine', time: '9:00 AM', type: 'medication', status: 'done' },
  { title: 'Evening Medication', time: '8:00 PM', type: 'medication', status: 'done' },
];

const FILTERS = ['all', 'medication', 'appointment', 'alert'];
const FILTER_LABELS = { all: 'All', medication: 'Meds', appointment: 'Appts', alert: 'Alerts' };

const TYPE_ICONS = { medication: 'medical', appointment: 'calendar', alert: 'warning' };
const TYPE_COLORS = { medication: Colors.primaryAction, appointment: Colors.success, alert: Colors.emergency };

export default function ActivityLogScreen({ navigation }) {
  const [filter, setFilter] = useState('all');

  const filterEntries = (entries) =>
    filter === 'all' ? entries : entries.filter((e) => e.type === filter);

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Activity Log"
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
        onEmergency={() => navigation.navigate('Emergency')}
      />
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {FILTER_LABELS[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <DateGroup label="Today" entries={filterEntries(ENTRIES_TODAY)} />
        <DateGroup label="Yesterday" entries={filterEntries(ENTRIES_YESTERDAY)} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DateGroup({ label, entries }) {
  if (entries.length === 0) return null;
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <View style={styles.groupBar} />
        <Text style={styles.groupTitle}>{label}</Text>
      </View>
      {entries.map((entry, i) => (
        <View key={i} style={styles.entryWrapper}>
          <CareCard padding={16} borderRadius={20}>
            <View style={styles.entryRow}>
              <View style={[styles.entryIcon, { backgroundColor: `${TYPE_COLORS[entry.type]}15` }]}>
                <Ionicons name={TYPE_ICONS[entry.type]} size={20} color={TYPE_COLORS[entry.type]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryTime}>{entry.time}</Text>
              </View>
              <StatusBadge type={entry.status} />
            </View>
          </CareCard>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 14, borderWidth: 3, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  filterChipActive: { borderColor: Colors.primaryAction, backgroundColor: Colors.blueBg },
  filterText: { fontSize: 16, fontWeight: '700', color: Colors.heading },
  filterTextActive: { color: Colors.primaryAction },
  scroll: { padding: 24 },
  group: { marginBottom: 24 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  groupBar: { width: 4, height: 24, borderRadius: 4, backgroundColor: Colors.primaryAction, marginRight: 12 },
  groupTitle: { fontSize: 20, fontWeight: '900', color: Colors.heading, flex: 1 },
  entryWrapper: { marginBottom: 8 },
  entryRow: { flexDirection: 'row', alignItems: 'center' },
  entryIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  entryTitle: { fontSize: 16, fontWeight: '700', color: Colors.heading },
  entryTime: { fontSize: 16, color: Colors.mutedText, marginTop: 2 },
});
