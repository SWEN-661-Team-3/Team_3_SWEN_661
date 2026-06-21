import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/providers/app_state.dart';

/// Drives every CareConnect route so a host script can run Accessibility Scanner.
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Accessibility Scanner route tour', (tester) async {
    const scanPause = Duration(seconds: 12);

    final appState = AppState();
    await appState.init();

    final app = CareConnectApp(appState: appState);

    await tester.pumpWidget(app);
    await tester.pumpAndSettle(const Duration(seconds: 2));

    final router = app.router;

    const onboardingRoutes = <String>[
      '/welcome',
      '/setup',
      '/preview',
      '/caregiver-setup',
      '/confirmation',
    ];

    for (final route in onboardingRoutes) {
      router.go(route);
      await tester.pumpAndSettle(const Duration(seconds: 2));
      // ignore: avoid_print
      print('A11Y_SCAN_READY:$route');
      await Future<void>.delayed(scanPause);
    }

    await appState.markOnboarded();
    await tester.pumpAndSettle(const Duration(seconds: 1));

    const mainRoutes = <String>[
      '/home',
      '/todays-plan',
      '/full-plan',
      '/details?id=2',
      '/success?type=complete&title=Eye%20Doctor%20Checkup',
      '/notification?reminderId=1',
      '/reminder-detail',
      '/snooze',
      '/reminder-success',
      '/missed-reminder',
      '/caregiver-help',
      '/notification-warning',
      '/reminder-preferences',
      '/emergency',
      '/emergency-countdown',
      '/emergency-confirmed',
      '/activity-log',
      '/schedule',
    ];

    for (final route in mainRoutes) {
      router.go(route);
      await tester.pumpAndSettle(const Duration(seconds: 2));
      // ignore: avoid_print
      print('A11Y_SCAN_READY:$route');
      await Future<void>.delayed(scanPause);
    }
  });
}
