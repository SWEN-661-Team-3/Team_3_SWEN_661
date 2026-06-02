import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/welcome_screen.dart';

void main() {
  group('WelcomeScreen', () {
    Widget buildWidget() {
      return const MaterialApp(home: WelcomeScreen());
    }

    testWidgets('displays CareConnect branding', (tester) async {
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(buildWidget());
      expect(find.text('CareConnect'), findsWidgets);
    });

    testWidgets('displays welcome heading', (tester) async {
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(buildWidget());
      expect(find.textContaining('Welcome to your'), findsOneWidget);
    });

    testWidgets('displays Start Setup button', (tester) async {
      tester.view.physicalSize = const Size(400, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(buildWidget());
      await tester.scrollUntilVisible(
        find.text('Start Setup'), 200,
        scrollable: find.byType(Scrollable).first,
      );
      expect(find.text('Start Setup'), findsOneWidget);
    });

    testWidgets('displays Use Recommended Settings button', (tester) async {
      tester.view.physicalSize = const Size(400, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(buildWidget());
      await tester.scrollUntilVisible(
        find.text('Use Recommended Settings'), 200,
        scrollable: find.byType(Scrollable).first,
      );
      expect(find.text('Use Recommended Settings'), findsOneWidget);
    });

    testWidgets('displays heart icon', (tester) async {
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(buildWidget());
      expect(find.byIcon(Icons.favorite), findsWidgets);
    });
  });
}
