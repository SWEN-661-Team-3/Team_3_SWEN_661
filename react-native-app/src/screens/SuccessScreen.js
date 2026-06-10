import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const TYPE_CONFIG = {
  complete: { icon: 'checkmark-circle', color: Colors.success, bg: Colors.successBg, heading: 'Task Complete!', message: 'Great job! Your task has been marked as done.' },
  snooze: { icon: 'time', color: Colors.warning, bg: Colors.warningBg, heading: 'Snoozed', message: 'We\'ll remind you again later.' },
  postpone: { icon: 'calendar', color: Colors.primaryAction, bg: Colors.blueBg, heading: 'Postponed', message: 'This task has been rescheduled.' },
};

export default function SuccessScreen({ navigation, route }) {
  const type = route.params?.type || 'complete';
  const title = route.params?.title || '';
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.complete;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>  
          <Ionicons name={config.icon} size={64} color={config.color} />
        </View>
        <Text style={styles.heading}>{config.heading}</Text>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.message}>{config.message}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Text style={styles.primaryText}>Return to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'TodaysPlan' }] })}
          >
            <Text style={styles.secondaryText}>Return to Today's Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityFooter}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.mutedText} />
          <Text style={styles.securityText}>Your data is stored securely on this device</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  heading: { fontSize: 30, fontWeight: '900', color: Colors.heading, textAlign: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: Colors.mutedText, marginTop: 8, textAlign: 'center' },
  message: { fontSize: 18, color: Colors.mutedText, textAlign: 'center', marginTop: 8, lineHeight: 28 },
  actions: { width: '100%', marginTop: 32, gap: 12 },
  primaryButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
  },
  primaryText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  secondaryButton: {
    backgroundColor: Colors.white, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
    borderWidth: 3, borderColor: Colors.primaryAction,
  },
  secondaryText: { fontSize: 20, fontWeight: '700', color: Colors.primaryAction },
  securityFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 32 },
  securityText: { fontSize: 14, color: Colors.mutedText },
});
