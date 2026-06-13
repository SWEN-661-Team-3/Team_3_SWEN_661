import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import CareCard from '../components/CareCard';
import Colors from '../theme/colors';
import { useAppState } from '../context/AppContext';

export default function ScheduleScreen({ navigation }) {
  const { state } = useAppState();

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="My Schedule"
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
        onEmergency={() => navigation.navigate('Emergency')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {state.todaysPlan.map((item) => {
          const isDone = item.status === 'done';
          return (
            <View key={item.id} style={styles.itemWrapper}>
              <CareCard onTap={() => navigation.navigate('Details', { id: item.id })}>
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: isDone ? Colors.successBg : Colors.blueBg }]}>
                    <Ionicons
                      name={isDone ? 'checkmark-circle' : 'time'}
                      size={28}
                      color={isDone ? Colors.success : Colors.primaryAction}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, isDone && styles.titleDone]}>
                      {item.title}
                    </Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: isDone ? Colors.successBg : Colors.blueBg }]}>
                    <Text style={[styles.badgeText, { color: isDone ? Colors.success : Colors.primaryAction }]}>
                      {isDone ? 'Done' : 'To Do'}
                    </Text>
                  </View>
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
  itemWrapper: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  icon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  titleDone: { color: Colors.mutedText, textDecorationLine: 'line-through' },
  time: { fontSize: 16, color: Colors.mutedText, marginTop: 4 },
  badge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { fontSize: 16, fontWeight: '700' },
});
