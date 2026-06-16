import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';
import { getActiveLabels } from '../models/AccessibilitySettings';

export default function ConfirmationScreen({ navigation }) {
  const { state, markOnboarded } = useAppState();
  const labels = getActiveLabels(state.settings);

  const handleContinue = async () => {
    await markOnboarded();
    navigation.reset({ index: 0, routes: [{ name: 'TodaysPlan' }] });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
          </View>
          <Text style={styles.heading}>You're All Set!</Text>
          <Text style={styles.body}>
            Your preferences have been saved. You can change these anytime from Settings.
          </Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <View style={styles.settingsIcon}>
              <Ionicons name="settings" size={24} color={Colors.primaryAction} />
            </View>
            <Text style={styles.settingsTitle}>Active Settings</Text>
          </View>
          {labels.length === 0 ? (
            <Text style={styles.noSettings}>Default settings active</Text>
          ) : (
            <View style={styles.chipContainer}>
              {labels.map((label, i) => (
                <View key={i} style={styles.chip}>
                  <View style={styles.chipCheck}>
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  </View>
                  <Text style={styles.chipText}>{label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleContinue} accessibilityRole="button">
          <Text style={styles.ctaText}>Go to Today's Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24, paddingBottom: 48, flexGrow: 1 },
  header: { alignItems: 'center', marginTop: 32, marginBottom: 32 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.successBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    maxWidth: '40%', aspectRatio: 1,
  },
  heading: { fontSize: 30, fontWeight: '900', color: Colors.heading, textAlign: 'center', flexShrink: 1 },
  body: { fontSize: 18, color: Colors.mutedText, textAlign: 'center', lineHeight: 28, marginTop: 8 },
  settingsCard: {
    backgroundColor: Colors.white, borderRadius: 24,
    borderWidth: 4, borderColor: Colors.border, padding: 24, marginBottom: 32,
  },
  settingsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  settingsIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.blueBg,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  settingsTitle: { fontSize: 20, fontWeight: '700', color: Colors.heading, flex: 1 },
  noSettings: { fontSize: 16, color: Colors.mutedText },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.blueBg, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 2, borderColor: Colors.blueLight,
  },
  chipCheck: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primaryAction,
    justifyContent: 'center', alignItems: 'center',
  },
  chipText: { fontSize: 16, fontWeight: '700', color: Colors.primaryAction },
  ctaButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center', marginTop: 'auto',
  },
  ctaText: { fontSize: 20, fontWeight: '700', color: Colors.white },
});
