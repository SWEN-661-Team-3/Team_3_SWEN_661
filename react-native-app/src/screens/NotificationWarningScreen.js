import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import Colors from '../theme/colors';

export default function NotificationWarningScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        onEmergency={() => navigation.navigate('Emergency')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications-off" size={48} color={Colors.warningDark} />
          </View>
          <Text style={styles.heading}>Notifications Are Off</Text>
          <Text style={styles.body}>
            Without notifications, you may miss important medication reminders and health alerts.
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={24} color={Colors.warningDark} />
          <Text style={styles.warningText}>
            Turning on notifications helps ensure you never miss a medication dose or appointment.
          </Text>
        </View>

        <View style={{ height: 32 }} />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            Alert.alert('Notifications', 'Notifications enabled (simulated)');
            navigation.goBack();
          }}
        >
          <Text style={styles.primaryText}>Enable Notifications</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryText}>Keep Turned Off</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24, flexGrow: 1 },
  header: { alignItems: 'center', marginTop: 16, marginBottom: 24 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.warningBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heading: { fontSize: 28, fontWeight: '900', color: Colors.heading, textAlign: 'center' },
  body: { fontSize: 18, color: Colors.mutedText, textAlign: 'center', lineHeight: 28, marginTop: 8 },
  warningBox: {
    flexDirection: 'row', gap: 12, padding: 20,
    backgroundColor: Colors.warningBg, borderRadius: 20,
    borderWidth: 2, borderColor: Colors.warningLight,
  },
  warningText: { fontSize: 16, color: Colors.warningDark, lineHeight: 24, flex: 1 },
  primaryButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
  },
  primaryText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  secondaryButton: {
    backgroundColor: Colors.white, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
    borderWidth: 3, borderColor: Colors.border,
  },
  secondaryText: { fontSize: 20, fontWeight: '700', color: Colors.mutedText },
});
