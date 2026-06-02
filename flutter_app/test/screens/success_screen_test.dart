import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/success_screen.dart';

void main() {
  group('SuccessScreen', () {
    testWidgets('displays complete variant by default', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: SuccessScreen()),
      );
      expect(find.text('Task Complete'), findsOneWidget);
      expect(find.text('COMPLETE'), findsOneWidget);
    });

    testWidgets('displays snooze variant', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: SuccessScreen(type: 'snooze', title: 'Meds')),
      );
      expect(find.text('Reminder Snoozed'), findsOneWidget);
      expect(find.text('SNOOZED'), findsOneWidget);
      expect(find.textContaining('Meds reminder snoozed'), findsOneWidget);
    });

    testWidgets('displays postpone variant', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: SuccessScreen(type: 'postpone', title: 'Walk')),
      );
      expect(find.text('Task Postponed'), findsOneWidget);
      expect(find.text('POSTPONED'), findsOneWidget);
      expect(find.textContaining('Walk has been moved'), findsOneWidget);
    });

    testWidgets('displays Return to Home button', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: SuccessScreen()),
      );
      expect(find.text('Return to Home'), findsOneWidget);
    });

    testWidgets('displays Return to Todays Plan button', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: SuccessScreen()),
      );
      expect(find.text("Return to Today's Plan"), findsOneWidget);
    });

    testWidgets('displays security footer', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: SuccessScreen()),
      );
      expect(find.text('Action Recorded Securely'), findsOneWidget);
    });
  });
}
