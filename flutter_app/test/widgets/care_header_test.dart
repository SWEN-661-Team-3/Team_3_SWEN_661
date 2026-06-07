import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/widgets/care_header.dart';

void main() {
  group('CareHeader', () {
    testWidgets('displays title', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: CareHeader(title: 'Test Title')),
        ),
      );
      expect(find.text('Test Title'), findsOneWidget);
    });

    testWidgets('displays subtitle when provided', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CareHeader(title: 'Title', subtitle: 'Sub'),
          ),
        ),
      );
      expect(find.text('Sub'), findsOneWidget);
    });

    testWidgets('shows back button when onBack provided', (tester) async {
      var pressed = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CareHeader(title: 'Back', onBack: () => pressed = true),
          ),
        ),
      );
      expect(find.byIcon(Icons.chevron_left), findsOneWidget);
      await tester.tap(find.byIcon(Icons.chevron_left));
      expect(pressed, true);
    });

    testWidgets('hides back button when no onBack', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: CareHeader(title: 'No Back')),
        ),
      );
      expect(find.byIcon(Icons.chevron_left), findsNothing);
    });

    testWidgets('shows accessibility button when onAccessibility provided', (tester) async {
      var pressed = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CareHeader(
              title: 'A11y',
              onAccessibility: () => pressed = true,
            ),
          ),
        ),
      );
      expect(find.byIcon(Icons.accessibility_new), findsOneWidget);
      await tester.tap(find.byIcon(Icons.accessibility_new));
      expect(pressed, true);
    });
  });
}
