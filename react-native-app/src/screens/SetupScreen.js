import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

const SECTIONS = [
  { key: 'textSize', title: 'Text Size', icon: 'text', options: ['large', 'extra-large'] },
  { key: 'contrast', title: 'Contrast Mode', icon: 'contrast', options: ['standard', 'high'] },
  { key: 'theme', title: 'Color Theme', icon: 'color-palette', options: ['light', 'dark'] },
  { key: 'spacing', title: 'Spacing', icon: 'expand', options: ['standard', 'wide'] },
  { key: 'motion', title: 'Motion', icon: 'pulse', options: ['reduced', 'full'] },
  { key: 'screenReader', title: 'Screen Reader', icon: 'volume-high', options: ['off', 'on'] },
];

const LABELS = {
  large: 'Large', 'extra-large': 'Extra Large',
  standard: 'Standard', high: 'High',
  light: 'Light', dark: 'Dark',
  wide: 'Wide', reduced: 'Reduced', full: 'Full',
  off: 'Off', on: 'On',
};

export default function SetupScreen({ navigation }) {
  const { state, updateSettings } = useAppState();
  const [local, setLocal] = useState({ ...state.settings });

  const handleSave = async () => {
    await updateSettings(local);
    navigation.navigate('Preview');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Accessibility Settings"
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Welcome')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {SECTIONS.map((section) => (
          <View key={section.key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name={section.icon} size={24} color={Colors.primaryAction} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.optionRow}>
              {section.options.map((opt) => {
                const isSelected = local[section.key] === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                    onPress={() => setLocal({ ...local, [section.key]: opt })}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {LABELS[opt] || opt}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={Colors.primaryAction} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityRole="button">
          <Text style={styles.saveButtonText}>Preview Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24, paddingBottom: 48 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.blueBg,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.heading, flex: 1 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  optionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 16, borderWidth: 3, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  optionChipSelected: { borderColor: Colors.primaryAction, backgroundColor: Colors.blueBg },
  optionText: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  optionTextSelected: { color: Colors.primaryAction },
  saveButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center', marginTop: 8,
  },
  saveButtonText: { fontSize: 20, fontWeight: '700', color: Colors.white },
});
