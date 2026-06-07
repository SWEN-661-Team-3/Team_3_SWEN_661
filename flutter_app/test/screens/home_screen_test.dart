import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/providers/app_state.dart';
import 'package:flutter_app/screens/home_screen.dart';

void main() {
  Widget buildTestWidget() {
    return ChangeNotifierProvider(
      create: (_) => AppState(),
      child: const MaterialApp(home: HomeScreen()),
    );
  }

  group('HomeScreen', () {
    testWidgets('displays CareConnect title', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text('CareConnect'), findsOneWidget);
    });

    testWidgets('displays Next Appointment section', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text('Next Appointment'), findsOneWidget);
    });

    testWidgets('displays Eye Exam appointment', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text('Eye Exam'), findsOneWidget);
    });

    testWidgets('displays Upcoming Reminders section', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text('Upcoming Reminders'), findsOneWidget);
    });

    testWidgets('displays Daily Health Tasks section', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.scrollUntilVisible(
        find.text('Daily Health Tasks'), 200,
        scrollable: find.byType(Scrollable).first,
      );
      expect(find.text('Daily Health Tasks'), findsOneWidget);
    });

    testWidgets('displays bottom navigation bar', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text('Full Plan'), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);
    });

    testWidgets('displays emergency button', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.byIcon(Icons.emergency), findsOneWidget);
    });
  });
}
