import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/widgets/status_badge.dart';

void main() {
  group('StatusBadge', () {
    testWidgets('renders Done badge', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: StatusBadge(type: BadgeType.done)),
        ),
      );
      expect(find.text('Done'), findsOneWidget);
      expect(find.byIcon(Icons.check_circle_outline), findsOneWidget);
    });

    testWidgets('renders Missed badge', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: StatusBadge(type: BadgeType.missed)),
        ),
      );
      expect(find.text('Missed'), findsOneWidget);
    });

    testWidgets('renders Sent badge', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: StatusBadge(type: BadgeType.sent)),
        ),
      );
      expect(find.text('Sent'), findsOneWidget);
    });

    testWidgets('renders To Do badge', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: StatusBadge(type: BadgeType.todo)),
        ),
      );
      expect(find.text('To Do'), findsOneWidget);
    });

    testWidgets('has Semantics label', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: StatusBadge(type: BadgeType.done)),
        ),
      );
      final semantics = tester.getSemantics(find.byType(StatusBadge));
      expect(semantics.label, contains('Done'));
    });
  });
}
