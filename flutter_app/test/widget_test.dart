import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/providers/app_state.dart';
import 'package:flutter_app/screens/home_screen.dart';

void main() {
  testWidgets('CareConnect home screen renders', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppState(),
        child: const MaterialApp(home: HomeScreen()),
      ),
    );

    expect(find.text('CareConnect'), findsOneWidget);
  });
}
