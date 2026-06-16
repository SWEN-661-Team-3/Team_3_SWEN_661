import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareCard from '../components/CareCard';
import CareBottomNavBar from '../components/CareBottomNavBar';
import Colors from '../theme/colors';
import { useAppState, getCompletedCount } from '../context/AppContext';

export default function TodaysPlanScreen({ navigation }) {
  const { state } = useAppState();
  const nextTask = state.todaysPlan.find((a) => a.status !== 'done');
  const firstName = state.caregivers.length > 0 ? state.caregivers[0].name : 'Friend';
  const completed = getCompletedCount(state.todaysPlan);
  const total = state.todaysPlan.length;
  const pending = total - completed;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} accessibilityLabel="Go home">
          <Ionicons name="home" size={28} color={Colors.heading} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Emergency')} accessibilityLabel="Emergency help">
          <Ionicons name="warning" size={28} color={Colors.emergency} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>Good Morning, {firstName}!</Text>
        <Text style={styles.subtitle}>
          You have {pending} {pending === 1 ? 'task' : 'tasks'} remaining today
        </Text>

        {nextTask && (
          <CareCard
            backgroundColor={Colors.primaryAction}
            borderColor={Colors.primaryActionDark}
            borderRadius={40}
            onTap={() => navigation.navigate('Details', { id: nextTask.id })}
          >
            <View style={styles.badge}>
              <Ionicons name="notifications" size={16} color={Colors.white} />
              <Text style={styles.badgeText}>Up Next</Text>
            </View>
            <Text style={styles.heroTitle}>{nextTask.title}</Text>
            <Text style={styles.heroTime}>{nextTask.time}</Text>
            <Text style={styles.heroHint}>Tap to see details</Text>
          </CareCard>
        )}

        <View style={{ height: 24 }} />
        <View style={styles.helperRow}>
          <View style={{ flex: 1, minWidth: 120 }}>
            <CareCard borderRadius={24} padding={20}>
              <Ionicons name="list" size={32} color={Colors.primaryAction} />
              <Text style={styles.helperTitle}>{completed}/{total}</Text>
              <Text style={styles.helperLabel}>Tasks Done</Text>
            </CareCard>
          </View>
          <View style={{ flex: 1, minWidth: 120 }}>
            <CareCard borderRadius={24} padding={20}>
              <Ionicons name="time" size={32} color={Colors.warning} />
              <Text style={styles.helperTitle}>{pending}</Text>
              <Text style={styles.helperLabel}>Pending</Text>
            </CareCard>
          </View>
        </View>

        <View style={{ height: 24 }} />
        <TouchableOpacity
          style={styles.shortcutButton}
          onPress={() => navigation.navigate('Setup')}
        >
          <Ionicons name="accessibility" size={20} color={Colors.primaryAction} />
          <Text style={styles.shortcutText}>Accessibility Shortcuts</Text>
        </TouchableOpacity>
      </ScrollView>
      <CareBottomNavBar
        onFullPlan={() => navigation.navigate('ExpandedPlan')}
        onSettings={() => navigation.navigate('Setup')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  topBar: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  scroll: { padding: 24, paddingTop: 0 },
  greeting: { fontSize: 30, fontWeight: '900', color: Colors.heading },
  subtitle: { fontSize: 18, color: Colors.mutedText, marginTop: 4, marginBottom: 24 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30,64,175,0.5)', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 6, marginBottom: 12,
  },
  badgeText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  heroTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  heroTime: { fontSize: 20, fontWeight: '700', color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  heroHint: { fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.85)', marginTop: 12 },
  helperRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  helperTitle: { fontSize: 28, fontWeight: '900', color: Colors.heading, marginTop: 8 },
  helperLabel: { fontSize: 16, fontWeight: '700', color: Colors.mutedText },
  shortcutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.blueBg, borderRadius: 16,
    paddingVertical: 14, borderWidth: 2, borderColor: Colors.blueLight,
  },
  shortcutText: { fontSize: 16, fontWeight: '700', color: Colors.primaryAction },
});
