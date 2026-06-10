import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function EmergencyConfirmedScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
        </View>
        <Text style={styles.heading}>Help Is On The Way</Text>
        <Text style={styles.body}>
          Your emergency contacts have been notified. Stay calm and stay where you are.
        </Text>

        <View style={styles.contactsSection}>
          <Text style={styles.contactsTitle}>Notified:</Text>
          <ContactRow name="Sarah" status="Notified" />
          <ContactRow name="Dr. Miller's Office" status="Notified" />
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        >
          <Text style={styles.homeText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ContactRow({ name, status }) {
  return (
    <View style={styles.contactRow}>
      <Ionicons name="person-circle" size={32} color={Colors.success} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.contactName}>{name}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.successBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  heading: { fontSize: 30, fontWeight: '900', color: Colors.heading, textAlign: 'center' },
  body: { fontSize: 18, color: Colors.mutedText, textAlign: 'center', lineHeight: 28, marginTop: 8, marginBottom: 32 },
  contactsSection: { width: '100%', marginBottom: 32 },
  contactsTitle: { fontSize: 18, fontWeight: '700', color: Colors.heading, marginBottom: 12 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  contactName: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  statusBadge: { backgroundColor: Colors.successBg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  statusText: { fontSize: 13, fontWeight: '700', color: Colors.success },
  homeButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, paddingHorizontal: 48, alignItems: 'center',
  },
  homeText: { fontSize: 20, fontWeight: '700', color: Colors.white },
});
