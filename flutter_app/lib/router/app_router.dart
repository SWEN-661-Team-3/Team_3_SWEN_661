import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../providers/app_state.dart';
import '../screens/home_screen.dart';
import '../screens/emergency_screen.dart';
import '../screens/activity_log_screen.dart';
import '../screens/details_screen.dart';
import '../screens/stub_screens.dart';

GoRoute _route(String path, Widget child) =>
    GoRoute(path: path, builder: (context, state) => child);

GoRouter createAppRouter(AppState appState) {
  return GoRouter(
    refreshListenable: appState,
    initialLocation: '/',
    redirect: (context, state) {
      final onboarded = appState.isOnboarded;
      final loc = state.matchedLocation;
      final goingToOnboarding = loc == '/welcome' ||
          loc == '/setup' ||
          loc == '/preview' ||
          loc == '/caregiver-setup' ||
          loc == '/confirmation';

      if (!onboarded && !goingToOnboarding) return '/welcome';
      if (onboarded && loc == '/welcome') return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/', redirect: (context, state) => '/home'),

      // Onboarding
      _route('/welcome', const WelcomeScreen()),
      _route('/setup', const SetupScreen()),
      _route('/preview', const PreviewScreen()),
      _route('/caregiver-setup', const CaregiverSetupScreen()),
      _route('/confirmation', const ConfirmationScreen()),

      // Home & Plan
      _route('/home', const HomeScreen()),
      _route('/todays-plan', const TodaysPlanScreen()),
      _route('/full-plan', const ExpandedPlanScreen()),

      // Detail & Success
      _route('/details', const DetailsScreen()),
      GoRoute(
        path: '/success',
        builder: (context, state) => SuccessScreen(
          type: state.uri.queryParameters['type'] ?? 'complete',
          title: state.uri.queryParameters['title'] ?? 'Task',
        ),
      ),

      // Reminders
      _route('/notification', const NotificationScreen()),
      _route('/reminder-detail', const ReminderDetailScreen()),
      _route('/snooze', const SnoozeOptionsScreen()),
      _route('/reminder-success', const ReminderSuccessScreen()),
      _route('/missed-reminder', const MissedReminderScreen()),

      // Caregiver & Settings
      _route('/caregiver-help', const CaregiverHelpScreen()),
      _route('/notification-warning', const NotificationWarningScreen()),
      _route('/reminder-preferences', const ReminderPreferencesScreen()),

      // Emergency
      _route('/emergency', const EmergencyScreen()),
      _route('/emergency-countdown', const EmergencyCountdownScreen()),
      _route('/emergency-confirmed', const EmergencyConfirmedScreen()),

      // History
      _route('/activity-log', const ActivityLogScreen()),
      _route('/schedule', const ScheduleScreen()),
    ],
    errorBuilder: (context, state) => const Scaffold(
      body: Center(child: Text('Page not found', style: TextStyle(fontSize: 24))),
    ),
  );
}
