import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import CareCard from '../components/CareCard';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

export default function PreviewScreen({ navigation }) {
  const { state, updateSettings } = useAppState();
  const [previewSize, setPreviewSize] = useState(state.settings.textSize);
  const [highContrast, setHighContrast] = useState(state.settings.contrast === 'high');

  const scaleFactor = previewSize === 'extra-large' ? 1.3 : 1.15;
  const cardBg = highContrast ? '#1E1E1E' : Colors.white;
  const cardBorder = highContrast ? '#444' : Colors.border;
  const textColor = highContrast ? Colors.white : Colors.heading;
  const mutedColor = highContrast ? 'rgba(255,255,255,0.7)' : Colors.mutedText;
  const accent = highContrast ? '#FACC15' : Colors.primaryAction;

  const handleLooksGood = async () => {
    await updateSettings({
      ...state.settings,
      textSize: previewSize,
      contrast: highContrast ? 'high' : 'standard',
    });
    navigation.navigate('CaregiverSetup');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Preview Settings"
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Setup')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Try Your Settings</Text>
        <Text style={styles.body}>See how the app looks with your preferences. Adjust if needed.</Text>

        <View style={styles.controls}>
          {['large', 'extra-large'].map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeButton, previewSize === size && styles.sizeButtonActive]}
              onPress={() => setPreviewSize(size)}
            >
              <Text style={[styles.sizeText, previewSize === size && styles.sizeTextActive]}>
                {size === 'large' ? 'Large' : 'Extra Large'}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.sizeButton, highContrast && styles.sizeButtonActive]}
            onPress={() => setHighContrast(!highContrast)}
          >
            <Text style={[styles.sizeText, highContrast && styles.sizeTextActive]}>
              High Contrast
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.previewContainer, { backgroundColor: highContrast ? '#000' : Colors.pageBg }]}>
          <CareCard backgroundColor={cardBg} borderColor={cardBorder}>
            <View style={styles.sampleRow}>
              <View style={[styles.sampleIcon, { backgroundColor: Colors.blueBg }]}>
                <Ionicons name="medical" size={24} color={accent} />
              </View>
              <View style={styles.sampleText}>
                <Text style={{ fontSize: 18 * scaleFactor, fontWeight: '700', color: textColor }}>
                  Eye Doctor Appt
                </Text>
                <Text style={{ fontSize: 16 * scaleFactor, color: mutedColor }}>
                  10:30 AM - 2 miles away
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: `${accent}25` }]}>
                <Text style={{ fontSize: 16 * scaleFactor, fontWeight: '700', color: accent }}>
                  Confirmed
                </Text>
              </View>
            </View>
          </CareCard>

          <View style={{ height: 12 }} />

          <CareCard backgroundColor={cardBg} borderColor={cardBorder}>
            <View style={styles.sampleRow}>
              <View style={[styles.sampleIcon, { backgroundColor: Colors.warningBg }]}>
                <Ionicons name="notifications" size={24} color={Colors.warningDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18 * scaleFactor, fontWeight: '700', color: textColor }}>
                  Medicine Reminder
                </Text>
                <Text style={{ fontSize: 16 * scaleFactor, color: mutedColor }}>
                  Take 1 Vitamin at Noon
                </Text>
              </View>
            </View>
          </CareCard>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLooksGood}>
            <Text style={styles.primaryText}>Looks Good!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Setup')}
          >
            <Text style={styles.secondaryText}>Make Changes</Text>
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
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  sizeButton: {
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14,
    borderWidth: 3, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  sizeButtonActive: { borderColor: Colors.primaryAction, backgroundColor: Colors.blueBg },
  sizeText: { fontSize: 16, fontWeight: '700', color: Colors.heading },
  sizeTextActive: { color: Colors.primaryAction },
  previewContainer: { borderRadius: 24, padding: 16, marginBottom: 24 },
  sampleRow: { flexDirection: 'row', alignItems: 'center' },
  sampleIcon: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  sampleText: { flex: 1 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  actions: { gap: 12 },
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
});
