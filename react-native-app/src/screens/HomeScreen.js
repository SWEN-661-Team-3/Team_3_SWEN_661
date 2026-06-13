import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareCard from '../components/CareCard';
import CareBottomNavBar from '../components/CareBottomNavBar';
import Colors from '../theme/colors';
import { useAppState, getCompletedCount } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { state } = useAppState();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const nextAppt = state.todaysPlan.find((a) => a.status !== 'done');
  const completedCount = getCompletedCount(state.todaysPlan);
  const pendingReminders = state.reminders.filter((r) => r.status === 'pending');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="heart" size={32} color={Colors.emergency} />
            <Text style={styles.appTitle}>CareConnect</Text>
            <TouchableOpacity
              style={styles.emergencyBtn}
              onPress={() => navigation.navigate('Emergency')}
              accessibilityRole="button"
              accessibilityLabel="Emergency help"
            >
              <Ionicons name="warning" size={28} color={Colors.emergency} />
            </TouchableOpacity>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.heading} />
            <Text style={styles.dateText}>{formattedDate.toUpperCase()}</Text>
          </View>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>

        {renderSectionHeading('Next Appointment', Colors.primaryAction)}
        {nextAppt ? (
          <CareCard
            backgroundColor={Colors.primaryAction}
            borderColor={Colors.primaryActionDark}
            borderRadius={40}
            onTap={() => navigation.navigate('Details', { id: nextAppt.id })}
          >
            <View style={styles.apptHeader}>
              <View style={styles.apptBadge}>
                <Text style={styles.apptBadgeText}>TODAY @ {nextAppt.time}</Text>
              </View>
              <Ionicons name="medical" size={32} color={Colors.white} />
            </View>
            <Text style={styles.apptTitle} numberOfLines={1}>{nextAppt.title}</Text>
            <Text style={styles.apptSubtitle}>{nextAppt.location || 'See details'}</Text>
            <View style={styles.apptAction}>
              <Text style={styles.apptActionText}>View Details</Text>
              <Ionicons name="chevron-forward" size={28} color={Colors.white} />
            </View>
          </CareCard>
        ) : (
          <CareCard backgroundColor={Colors.successBg} borderColor={Colors.success} borderRadius={40}>
            <View style={{ alignItems: 'center', padding: 16 }}>
              <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
              <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.success, marginTop: 8 }}>All Done!</Text>
            </View>
          </CareCard>
        )}

        <View style={{ height: 32 }} />
        {renderSectionHeading('Upcoming Reminders', Colors.warning)}
        <View style={{ height: 16 }} />
        {pendingReminders.map((r, i) => (
          <View key={r.id}>
            {i > 0 && <View style={{ height: 12 }} />}
            {renderReminderItem(
              navigation,
              r.type === 'hydration' ? 'water' : 'medical',
              r.type === 'hydration' ? Colors.blueLight : Colors.warningLight,
              r.type === 'hydration' ? Colors.primaryAction : Colors.warningDark,
              r.title,
              r.dueTime.toUpperCase(),
              r.id
            )}
          </View>
        ))}

        <View style={{ height: 32 }} />
        {renderSectionHeading('Daily Health Tasks', Colors.success)}
        <View style={{ height: 16 }} />
        {state.todaysPlan.slice(0, 3).map((task, i) => (
          <View key={task.id}>
            {i > 0 && <View style={{ height: 8 }} />}
            {renderTaskItem(task.title, task.status === 'done')}
          </View>
        ))}

        <View style={{ height: 32 }} />
        {renderSectionHeading('Quick Links', Colors.caregiver)}
        <View style={{ height: 16 }} />
        {renderQuickLink(navigation, 'time', 'Activity Log', 'ActivityLog')}
        <View style={{ height: 8 }} />
        {renderQuickLink(navigation, 'calendar', 'My Schedule', 'Schedule')}
        <View style={{ height: 8 }} />
        {renderQuickLink(navigation, 'options', 'Reminder Preferences', 'ReminderPreferences')}
        <View style={{ height: 8 }} />
        {renderQuickLink(navigation, 'notifications-off', 'Notification Settings', 'NotificationWarning')}

        <View style={{ height: 24 }} />
        <View style={styles.lastUpdated}>
          <Ionicons name="refresh" size={16} color={Colors.mutedText} />
          <Text style={styles.lastUpdatedText}>Last Updated: Just now</Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
      <CareBottomNavBar
        onFullPlan={() => navigation.navigate('ExpandedPlan')}
        onSettings={() => navigation.navigate('Setup')}
      />
    </SafeAreaView>
  );
}

function renderSectionHeading(text, barColor) {
  return (
    <View style={styles.sectionRow}>
      <View style={[styles.sectionBar, { backgroundColor: barColor }]} />
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

function renderReminderItem(navigation, icon, iconBg, iconColor, title, subtitle, reminderId) {
  return (
    <CareCard onTap={() => navigation.navigate('Notification', { reminderId })}>
      <View style={styles.reminderRow}>
        <View style={[styles.reminderIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reminderTitle}>{title}</Text>
          <Text style={styles.reminderSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.disabledText} />
      </View>
    </CareCard>
  );
}

function renderTaskItem(label, completed) {
  return (
    <View style={[styles.taskItem, completed ? styles.taskDone : styles.taskPending]}>
      {completed ? (
        <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
      ) : (
        <View style={styles.taskCircle} />
      )}
      <Text style={[styles.taskLabel, { color: completed ? Colors.heading : Colors.mutedText }]}>
        {label}
      </Text>
    </View>
  );
}

function renderQuickLink(navigation, icon, label, route) {
  return (
    <CareCard onTap={() => navigation.navigate(route)} padding={16}>
      <View style={styles.quickRow}>
        <Ionicons name={icon} size={24} color={Colors.primaryAction} />
        <Text style={styles.quickLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={24} color={Colors.disabledText} />
      </View>
    </CareCard>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24 },
  header: { marginBottom: 24 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  appTitle: { fontSize: 24, fontWeight: '900', color: Colors.heading, flex: 1, marginLeft: 12 },
  emergencyBtn: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.blueBg,
    justifyContent: 'center', alignItems: 'center',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  dateText: { fontSize: 16, fontWeight: '700', letterSpacing: 2, color: Colors.heading, marginLeft: 8, flex: 1, flexShrink: 1 },
  timeText: { fontSize: 42, fontWeight: '900', color: Colors.heading, marginTop: 4, flexShrink: 1 },
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  apptBadge: {
    backgroundColor: 'rgba(30,64,175,0.5)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, flexShrink: 1,
  },
  apptBadgeText: { fontSize: 16, fontWeight: '900', letterSpacing: 1.5, color: Colors.white, flexShrink: 1 },
  apptTitle: { fontSize: 36, fontWeight: '900', color: Colors.white, marginTop: 16, flexShrink: 1 },
  apptSubtitle: { fontSize: 20, fontWeight: '700', color: 'rgba(255,255,255,0.75)', flexShrink: 1 },
  apptAction: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(30,64,175,0.5)', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 14, marginTop: 16,
  },
  apptActionText: { fontSize: 18, fontWeight: '700', color: Colors.white },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionBar: { width: 4, height: 24, borderRadius: 4, marginRight: 12 },
  sectionText: { fontSize: 22, fontWeight: '900', color: Colors.heading, flex: 1 },
  reminderRow: { flexDirection: 'row', alignItems: 'center' },
  reminderIcon: {
    padding: 12, borderRadius: 20, marginRight: 16,
  },
  reminderTitle: { fontSize: 18, fontWeight: '900', color: Colors.heading },
  reminderSubtitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1.5, color: Colors.mutedText },
  taskItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderRadius: 20, borderWidth: 2, gap: 12,
  },
  taskDone: { backgroundColor: Colors.white, borderColor: Colors.successLight },
  taskPending: { backgroundColor: 'rgba(241,245,249,0.5)', borderColor: Colors.border },
  taskCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: Colors.disabledText },
  taskLabel: { fontSize: 16, fontWeight: '700', flex: 1 },
  quickRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  quickLabel: { fontSize: 18, fontWeight: '700', color: Colors.heading, flex: 1 },
  lastUpdated: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  lastUpdatedText: { fontSize: 16, color: Colors.mutedText },
});
