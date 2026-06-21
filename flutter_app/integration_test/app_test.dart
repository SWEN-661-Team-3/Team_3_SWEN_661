import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/providers/app_state.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('CareConnect integration flows', () {
    testWidgets('onboarding: welcome to setup to preview', (tester) async {
      final appState = AppState();
      await appState.init();

      await tester.pumpWidget(CareConnectApp(appState: appState));
      await tester.pumpAndSettle();

      expect(find.text('Start Setup'), findsOneWidget);
      await tester.tap(find.text('Start Setup'));
      await tester.pumpAndSettle();

      expect(find.text('Personalize your view'), findsOneWidget);
      await tester.tap(find.text('Preview Settings'));
      await tester.pumpAndSettle();

      expect(find.text('How does this look?'), findsOneWidget);
    });

    testWidgets('home to details workflow', (tester) async {
      final appState = AppState();
      await appState.init();
      await appState.markOnboarded();

      await tester.pumpWidget(CareConnectApp(appState: appState));
      await tester.pumpAndSettle();

      expect(find.text('CareConnect'), findsWidgets);
      expect(find.text('View Details'), findsOneWidget);

      await tester.tap(find.text('View Details'));
      await tester.pumpAndSettle();

      expect(find.text('Item Details'), findsOneWidget);
      expect(find.text('Mark Complete'), findsOneWidget);
    });

    testWidgets('emergency help screen is reachable', (tester) async {
      final appState = AppState();
      await appState.init();
      await appState.markOnboarded();

      await tester.pumpWidget(CareConnectApp(appState: appState));
      await tester.pumpAndSettle();

      final emergencyFinder = find.bySemanticsLabel('Emergency help');
      expect(emergencyFinder, findsOneWidget);

      await tester.tap(emergencyFinder);
      await tester.pumpAndSettle();

      expect(find.text('Emergency Help'), findsOneWidget);
      expect(
        find.bySemanticsLabel('I need help, alert care circle'),
        findsOneWidget,
      );
      expect(
        find.bySemanticsLabel('Alerts your care circle when you need help'),
        findsOneWidget,
      );
    });

    testWidgets('reminder notification workflow', (tester) async {
      final appState = AppState();
      await appState.init();
      await appState.markOnboarded();

      await tester.pumpWidget(CareConnectApp(appState: appState));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Afternoon Medication'));
      await tester.pumpAndSettle();

      expect(find.text('View Details'), findsWidgets);
      expect(find.text('Mark Done'), findsOneWidget);
    });
  });
}
