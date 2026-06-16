import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppState } from '../context/AppContext';

import WelcomeScreen from '../screens/WelcomeScreen';
import SetupScreen from '../screens/SetupScreen';
import PreviewScreen from '../screens/PreviewScreen';
import CaregiverSetupScreen from '../screens/CaregiverSetupScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import HomeScreen from '../screens/HomeScreen';
import TodaysPlanScreen from '../screens/TodaysPlanScreen';
import ExpandedPlanScreen from '../screens/ExpandedPlanScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SuccessScreen from '../screens/SuccessScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ReminderDetailScreen from '../screens/ReminderDetailScreen';
import SnoozeOptionsScreen from '../screens/SnoozeOptionsScreen';
import ReminderSuccessScreen from '../screens/ReminderSuccessScreen';
import MissedReminderScreen from '../screens/MissedReminderScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import EmergencyConfirmedScreen from '../screens/EmergencyConfirmedScreen';
import CaregiverHelpScreen from '../screens/CaregiverHelpScreen';
import NotificationWarningScreen from '../screens/NotificationWarningScreen';
import ReminderPreferencesScreen from '../screens/ReminderPreferencesScreen';
import ActivityLogScreen from '../screens/ActivityLogScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { state } = useAppState();

  if (!state.initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={state.isOnboarded === true ? 'Home' : 'Welcome'}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen name="CaregiverSetup" component={CaregiverSetupScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TodaysPlan" component={TodaysPlanScreen} />
      <Stack.Screen name="ExpandedPlan" component={ExpandedPlanScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="ReminderDetail" component={ReminderDetailScreen} />
      <Stack.Screen name="SnoozeOptions" component={SnoozeOptionsScreen} />
      <Stack.Screen name="ReminderSuccess" component={ReminderSuccessScreen} />
      <Stack.Screen name="MissedReminder" component={MissedReminderScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="EmergencyConfirmed" component={EmergencyConfirmedScreen} />
      <Stack.Screen name="CaregiverHelp" component={CaregiverHelpScreen} />
      <Stack.Screen name="NotificationWarning" component={NotificationWarningScreen} />
      <Stack.Screen name="ReminderPreferences" component={ReminderPreferencesScreen} />
      <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
    </Stack.Navigator>
  );
}
