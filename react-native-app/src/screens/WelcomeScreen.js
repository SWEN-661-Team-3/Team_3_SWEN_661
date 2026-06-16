import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={48} color={Colors.emergency} />
          </View>
          <Text style={styles.appName}>CareConnect</Text>
          <Text style={styles.tagline}>Your Daily Health Companion</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>Welcome!</Text>
          <Text style={styles.body}>
            Let's set up your experience. We'll personalize the app to make it easy and comfortable for you to use every day.
          </Text>

          <View style={styles.featureList}>
            {[
              { icon: 'text', label: 'Large, easy-to-read text' },
              { icon: 'notifications', label: 'Gentle medication reminders' },
              { icon: 'people', label: 'Stay connected with caregivers' },
              { icon: 'calendar', label: 'Simple daily schedule' },
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={20} color={Colors.primaryAction} />
                </View>
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Setup')}
            accessibilityRole="button"
            accessibilityLabel="Start Setup"
          >
            <Text style={styles.primaryButtonText}>Start Setup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Setup')}
            accessibilityRole="button"
            accessibilityLabel="Use Recommended Settings"
          >
            <Text style={styles.secondaryButtonText}>Use Recommended Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { flexGrow: 1, padding: 24 },
  heroSection: { alignItems: 'center', marginTop: 32, marginBottom: 32 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.emergencyBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  appName: { fontSize: 36, fontWeight: '900', color: Colors.heading, letterSpacing: -0.5 },
  tagline: { fontSize: 18, fontWeight: '500', color: Colors.mutedText, marginTop: 4 },
  content: { marginBottom: 32 },
  heading: { fontSize: 28, fontWeight: '900', color: Colors.heading, marginBottom: 12 },
  body: { fontSize: 18, fontWeight: '400', color: Colors.mutedText, lineHeight: 28 },
  featureList: { marginTop: 24, gap: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.blueBg,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  featureText: { fontSize: 18, fontWeight: '700', color: Colors.heading, flex: 1 },
  buttons: { gap: 12, marginTop: 'auto', paddingBottom: 24 },
  primaryButton: {
    backgroundColor: Colors.primaryAction, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
  },
  primaryButtonText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  secondaryButton: {
    backgroundColor: Colors.white, borderRadius: 20,
    paddingVertical: 18, alignItems: 'center',
    borderWidth: 3, borderColor: Colors.primaryAction,
  },
  secondaryButtonText: { fontSize: 20, fontWeight: '700', color: Colors.primaryAction },
});
