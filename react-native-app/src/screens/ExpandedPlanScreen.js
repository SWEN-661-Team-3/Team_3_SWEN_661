import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CareHeader from '../components/CareHeader';
import Colors from '../theme/colors';
import { useAppState, getCompletedCount } from '../context/AppContext';

function getTimeGroup(time) {
  const hour = parseInt(time, 10);
  const isPM = time.toUpperCase().includes('PM');
  const h24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
  if (h24 < 12) return 'Morning';
  if (h24 < 17) return 'Afternoon';
  return 'Evening';
}

export default function ExpandedPlanScreen({ navigation }) {
  const { state } = useAppState();
  const completed = getCompletedCount(state.todaysPlan);
  const total = state.todaysPlan.length;
  const progress = total > 0 ? completed / total : 0;

  const groups = {};
  state.todaysPlan.forEach((item) => {
    const g = getTimeGroup(item.time);
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  return (
    <SafeAreaView style={styles.safe}>
      <CareHeader
        title="Full Plan"
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {['Morning', 'Afternoon', 'Evening'].map((group) => {
          const items = groups[group];
          if (!items || items.length === 0) return null;
          return (
            <View key={group} style={styles.group}>
              <Text style={styles.groupTitle}>{group}</Text>
              {items.map((item) => {
                const isDone = item.status === 'done';
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.planItem}
                    onPress={() => navigation.navigate('Details', { id: item.id })}
                  >
                    <View style={styles.iconCol}>
                      {isDone ? (
                        <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
                      ) : (
                        <View style={styles.todoCircle} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.badgeRow}>
                        <View style={[styles.timeBadge, isDone && styles.timeBadgeDone]}>
                          <Text style={[styles.timeBadgeText, isDone && { color: Colors.mutedText }]}>
                            {item.time}
                          </Text>
                        </View>
                        {item.actionLabel && (
                          <View style={[styles.actionBadge, isDone && styles.actionBadgeDone]}>
                            <Text style={[styles.actionBadgeText, isDone && { color: Colors.mutedText }]}>
                              {item.actionLabel}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressRow}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.progressText}>{completed} of {total} completed</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { padding: 24, paddingBottom: 120 },
  group: { marginBottom: 24 },
  groupTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 2, color: Colors.mutedText, marginBottom: 12, textTransform: 'uppercase' },
  planItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconCol: { width: 40, alignItems: 'center', marginRight: 12, paddingTop: 4 },
  todoCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: Colors.disabledText },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  timeBadge: { backgroundColor: Colors.blueBg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 },
  timeBadgeDone: { backgroundColor: Colors.subtleBg },
  timeBadgeText: { fontSize: 13, fontWeight: '700', color: Colors.primaryAction },
  actionBadge: { backgroundColor: Colors.blueBg, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4 },
  actionBadgeDone: { backgroundColor: Colors.subtleBg },
  actionBadgeText: { fontSize: 13, fontWeight: '700', color: Colors.primaryAction },
  itemTitle: { fontSize: 18, fontWeight: '700', color: Colors.heading },
  itemTitleDone: { color: Colors.mutedText, textDecorationLine: 'line-through', textDecorationColor: Colors.heading },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopWidth: 4, borderTopColor: Colors.border,
    padding: 24, paddingBottom: 40,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  progressText: { fontSize: 16, fontWeight: '700', color: Colors.heading, flex: 1 },
  progressBar: { height: 8, backgroundColor: Colors.subtleBg, borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: Colors.success, borderRadius: 4 },
});
