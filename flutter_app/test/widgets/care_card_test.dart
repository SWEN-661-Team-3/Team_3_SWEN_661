import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/widgets/care_card.dart';

void main() {
  group('CareCard', () {
    testWidgets('renders child widget', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CareCard(child: Text('Hello')),
          ),
        ),
      );
      expect(find.text('Hello'), findsOneWidget);
    });

    testWidgets('wraps in GestureDetector when onTap provided', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CareCard(
              onTap: () => tapped = true,
              child: const Text('Tap me'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Tap me'));
      expect(tapped, true);
    });

    testWidgets('does not wrap in GestureDetector when no onTap', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CareCard(child: Text('Static')),
          ),
        ),
      );
      expect(find.byType(GestureDetector), findsNothing);
    });

    testWidgets('has Semantics label when wrapped by caller', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Semantics(
              button: true,
              label: 'Open activity log',
              child: GestureDetector(
                onTap: () {},
                child: const CareCard(child: Text('Button card')),
              ),
            ),
          ),
        ),
      );
      final semantics = tester.getSemantics(find.text('Button card'));
      expect(semantics.label, contains('Open activity log'));
    });
  });
}
