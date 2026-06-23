import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/providers/app_state.dart';

/// Single-route scan helper for fast verification.
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Accessibility Scanner home route', (tester) async {
    const scanPause = Duration(seconds: 5);

    final appState = AppState();
    await appState.init();
    await appState.markOnboarded();

    final app = CareConnectApp(appState: appState);
    await tester.pumpWidget(app);
    await tester.pumpAndSettle(const Duration(seconds: 1));

    app.router.go('/home');
    await tester.pumpAndSettle(const Duration(seconds: 1));
    // ignore: avoid_print
    print('A11Y_SCAN_READY:/home');
    await Future<void>.delayed(scanPause);
  });
}
