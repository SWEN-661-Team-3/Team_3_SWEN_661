import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

const PERMISSION_OPTIONS = [
  { key: 'appointments', label: 'View Appointments', icon: 'calendar' },
  { key: 'reminders', label: 'Medication Reminders', icon: 'notifications' },
  { key: 'help', label: 'Respond to Help Requests', icon: 'hand-left' },
];

export default function CaregiverSetupScreen({ navigation }) {
  const { addCaregiver } = useAppState();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [permissions, setPermissions] = useState(new Set(['appointments', 'reminders', 'help']));

  const nameValid = name.trim().length > 0;

  const togglePermission = (key) => {
    const next = new Set(permissions);
    next.has(key) ? next.delete(key) : next.add(key);
    setPermissions(next);
  };

  const handleAdd = () => {
    addCaregiver({
      id: Date.now().toString(),
      name: name.trim(),
      relationship: relationship.trim() || 'Family',
      phone: phone.trim(),
      permissions: [...permissions],
    });
    navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Add Help"
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Welcome')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Add a Caregiver</Text>
        <Text style={styles.body}>
          Add someone who helps take care of you. They can receive alerts and check on your schedule.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Sarah Johnson"
            placeholderTextColor={Colors.disabledText}
            accessibilityLabel="Full Name"
          />
          <Text style={styles.label}>Relationship</Text>
          <TextInput
            style={styles.input}
            value={relationship}
            onChangeText={setRelationship}
            placeholder="e.g., Daughter"
            placeholderTextColor={Colors.disabledText}
            accessibilityLabel="Relationship"
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g., 555-0101"
            placeholderTextColor={Colors.disabledText}
            keyboardType="phone-pad"
            accessibilityLabel="Phone Number"
          />
        </View>

        <View style={styles.permissionsSection}>
          <View style={styles.permissionsHeader}>
            <View style={styles.permIcon}>
              <Ionicons name="shield" size={24} color={Colors.primaryAction} />
            </View>
            <Text style={styles.permTitle}>What they can see</Text>
          </View>
          {PERMISSION_OPTIONS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={styles.permRow}
              onPress={() => togglePermission(p.key)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: permissions.has(p.key) }}
            >
              <Ionicons
                name={permissions.has(p.key) ? 'checkbox' : 'square-outline'}
                size={24}
                color={permissions.has(p.key) ? Colors.primaryAction : Colors.disabledText}
              />
              <Ionicons name={p.icon} size={20} color={Colors.mutedText} style={{ marginLeft: 12 }} />
              <Text style={styles.permLabel}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, !nameValid && styles.disabledButton]}
            onPress={handleAdd}
            disabled={!nameValid}
            accessibilityRole="button"
          >
            <Text style={[styles.primaryText, !nameValid && styles.disabledText]}>Add Caregiver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Confirmation')}
          >
            <Text style={styles.secondaryText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24, paddingBottom: 48 },
  heading: { fontSize: 28, fontWeight: '900', color: Colors.heading, marginBottom: 8 },
  body: { fontSize: 18, color: Colors.mutedText, lineHeight: 28, marginBottom: 24 },
  form: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '700', color: Colors.heading, marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 3, borderColor: Colors.border, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 18, color: Colors.heading, backgroundColor: Colors.white,
  },
  permissionsSection: { marginBottom: 32 },
  permissionsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  permIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.blueBg,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  permTitle: { fontSize: 20, fontWeight: '700', color: Colors.heading, flex: 1 },
  permRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 8,
  },
  permLabel: { fontSize: 18, fontWeight: '500', color: Colors.heading, marginLeft: 12, flex: 1 },
  actions: { gap: 12 },
  primaryButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
  },
  primaryText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  disabledButton: { backgroundColor: Colors.border },
  disabledText: { color: Colors.disabledText },
  secondaryButton: {
    backgroundColor: Colors.white, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
    borderWidth: 3, borderColor: Colors.primaryAction,
  },
  secondaryText: { fontSize: 20, fontWeight: '700', color: Colors.primaryAction },
});
