import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/providers/app_state.dart';
import 'package:flutter_app/screens/confirmation_screen.dart';

void main() {
  Widget buildTestWidget() {
    return ChangeNotifierProvider(
      create: (_) => AppState(),
      child: const MaterialApp(home: ConfirmationScreen()),
    );
  }

  group('ConfirmationScreen', () {
    testWidgets('displays success heading', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text("You're all set!"), findsOneWidget);
    });

    testWidgets('displays preferences saved message', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(
        find.textContaining('Your preferences are saved'),
        findsOneWidget,
      );
    });

    testWidgets('displays Active Settings section', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text('Active Settings'), findsOneWidget);
    });

    testWidgets('displays Go to Todays Plan button', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.text("Go to Today's Plan"), findsOneWidget);
    });

    testWidgets('displays check circle icon', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.byIcon(Icons.check_circle), findsOneWidget);
    });

    testWidgets('displays settings icon', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.byIcon(Icons.settings), findsOneWidget);
    });
  });
}
