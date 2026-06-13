import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import CareCard from '../components/CareCard';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

export default function CaregiverHelpScreen({ navigation }) {
  const { state } = useAppState();
  const [notified, setNotified] = useState(new Set());

  const handleNotify = (id, name) => {
    setNotified(new Set([...notified, id]));
    Alert.alert('Notification Sent', `${name} has been notified.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Ask for Help"
        onBack={() => navigation.goBack()}
        onEmergency={() => navigation.navigate('Emergency')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Your Caregivers</Text>
        <Text style={styles.body}>Tap a caregiver to send them a notification.</Text>

        {state.caregivers.map((cg) => {
          const isNotified = notified.has(cg.id);
          return (
            <View key={cg.id} style={styles.cardWrapper}>
              <CareCard
                borderColor={isNotified ? Colors.success : Colors.border}
                onTap={() => !isNotified && handleNotify(cg.id, cg.name)}
              >
                <View style={styles.row}>
                  <View style={[styles.avatar, { backgroundColor: isNotified ? Colors.successBg : Colors.blueBg }]}>
                    <Ionicons name="person" size={28} color={isNotified ? Colors.success : Colors.primaryAction} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{cg.name}</Text>
                    <Text style={styles.relationship}>{cg.relationship}</Text>
                  </View>
                  {isNotified ? (
                    <View style={styles.notifiedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                      <Text style={styles.notifiedText}>Notified</Text>
                    </View>
                  ) : (
                    <Ionicons name="send" size={24} color={Colors.primaryAction} />
                  )}
                </View>
              </CareCard>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24 },
  heading: { fontSize: 28, fontWeight: '900', color: Colors.heading, marginBottom: 8 },
  body: { fontSize: 18, color: Colors.mutedText, lineHeight: 28, marginBottom: 24 },
  cardWrapper: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  name: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  relationship: { fontSize: 16, color: Colors.mutedText, marginTop: 2 },
  notifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.successBg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  notifiedText: { fontSize: 16, fontWeight: '700', color: Colors.success },
});
