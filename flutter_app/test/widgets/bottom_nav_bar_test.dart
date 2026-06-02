import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/widgets/bottom_nav_bar.dart';

void main() {
  group('CareBottomNavBar', () {
    testWidgets('renders Full Plan and Settings buttons', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(bottomNavigationBar: CareBottomNavBar()),
        ),
      );
      expect(find.text('Full Plan'), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);
    });

    testWidgets('Full Plan button triggers onFullPlan callback', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: CareBottomNavBar(
              onFullPlan: () => tapped = true,
            ),
          ),
        ),
      );
      await tester.tap(find.text('Full Plan'));
      expect(tapped, true);
    });

    testWidgets('Settings button triggers onSettings callback', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: CareBottomNavBar(
              onSettings: () => tapped = true,
            ),
          ),
        ),
      );
      await tester.tap(find.text('Settings'));
      expect(tapped, true);
    });

    testWidgets('buttons are disabled when callbacks are null', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(bottomNavigationBar: CareBottomNavBar()),
        ),
      );
      final fullPlanButton = tester.widget<ElevatedButton>(
        find.widgetWithText(ElevatedButton, 'Full Plan'),
      );
      expect(fullPlanButton.onPressed, isNull);
    });
  });
}
