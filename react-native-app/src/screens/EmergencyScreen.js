import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { buttonA11y } from '../utils/accessibility';

export default function EmergencyScreen({ navigation }) {
  const [counting, setCounting] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (counting && countdown > 0) {
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    } else if (counting && countdown === 0 && mountedRef.current) {
      navigation.navigate('EmergencyConfirmed');
    }
    return () => clearTimeout(timerRef.current);
  }, [counting, countdown, navigation]);

  const handleStart = () => {
    setCounting(true);
    setCountdown(10);
  };

  const handleCancel = () => {
    clearTimeout(timerRef.current);
    setCounting(false);
    setCountdown(10);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {!counting ? (
          <>
            <View style={styles.iconCircle}>
              <Ionicons name="warning" size={64} color={Colors.emergency} />
            </View>
            <Text style={styles.heading}>Emergency Help</Text>
            <Text style={styles.body}>
              Tap the button below if you need immediate help. Your emergency contacts will be notified.
            </Text>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={handleStart}
              {...buttonA11y('I Need Help', 'Starts a 10 second countdown to alert your care circle')}
            >
              <Text style={styles.helpText}>I Need Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelLink} onPress={() => navigation.goBack()} {...buttonA11y('Cancel', 'Returns without sending an alert')}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.countdownLabel}>Sending alert in</Text>
            <Text style={styles.countdownNumber} accessibilityLiveRegion="polite" accessibilityLabel={`Sending alert in ${countdown} seconds`}>{countdown}</Text>
            <Text style={styles.countdownSub}>seconds</Text>

            <View style={styles.contactsSection}>
              <Text style={styles.contactsTitle}>Notifying:</Text>
              <ContactRow name="Sarah" relationship="Daughter" />
              <ContactRow name="Dr. Miller's Office" relationship="Doctor" />
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} {...buttonA11y('Cancel emergency alert', 'Stops the countdown without notifying contacts')}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactRow({ name, relationship }) {
  return (
    <View style={styles.contactRow}>
      <Ionicons name="person-circle" size={32} color={Colors.mutedText} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.contactName}>{name}</Text>
        <Text style={styles.contactRel}>{relationship}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.emergencyBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  heading: { fontSize: 30, fontWeight: '900', color: Colors.heading },
  body: { fontSize: 18, color: Colors.mutedText, textAlign: 'center', lineHeight: 28, marginTop: 8, marginBottom: 32 },
  helpButton: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.emergency, justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.emergency, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  helpText: { fontSize: 24, fontWeight: '900', color: Colors.white },
  cancelLink: { marginTop: 24 },
  cancelText: { fontSize: 18, fontWeight: '700', color: Colors.mutedText },
  countdownLabel: { fontSize: 20, fontWeight: '700', color: Colors.mutedText },
  countdownNumber: { fontSize: 96, fontWeight: '900', color: Colors.emergency },
  countdownSub: { fontSize: 20, fontWeight: '700', color: Colors.mutedText, marginBottom: 32 },
  contactsSection: { width: '100%', marginBottom: 32 },
  contactsTitle: { fontSize: 18, fontWeight: '700', color: Colors.heading, marginBottom: 12 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  contactName: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  contactRel: { fontSize: 16, color: Colors.mutedText },
  cancelButton: {
    backgroundColor: Colors.white, borderRadius: 20, paddingVertical: 18, paddingHorizontal: 48,
    borderWidth: 3, borderColor: Colors.emergency,
  },
  cancelButtonText: { fontSize: 20, fontWeight: '700', color: Colors.emergency },
});
