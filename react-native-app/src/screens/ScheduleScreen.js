import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import IconBadge from '../components/IconBadge';
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
          const isSnoozed = item.status === 'snoozed';
          const isClosed = isDone || isSnoozed;
          return (
            <View key={item.id} style={styles.itemWrapper}>
              <CareCard onTap={isClosed ? undefined : () => navigation.navigate('Details', { id: item.id })}>
                <View style={styles.row}>
                  <IconBadge
                    icon={isDone ? 'checkmark-circle' : 'time'}
                    color={isDone ? Colors.success : Colors.primaryAction}
                    size={28}
                    padding={14}
                    borderRadius={16}
                  />
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={[styles.title, isDone && styles.titleDone]}>
                      {item.title}
                    </Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: isDone ? Colors.success : Colors.primaryAction }]}>
                    <Text style={[styles.badgeText, { color: Colors.white }]}>
                      {isDone ? 'Done' : isSnoozed ? 'Snoozed' : 'To Do'}
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
  title: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  titleDone: { color: Colors.heading, textDecorationLine: 'line-through' },
  time: { fontSize: 16, color: Colors.mutedText, marginTop: 4 },
  badge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { fontSize: 16, fontWeight: '700' },
});
