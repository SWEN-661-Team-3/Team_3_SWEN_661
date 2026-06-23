import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/providers/app_state.dart';

/// Drives only routes under active a11y testing (fast path).
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Accessibility Scanner target routes', (tester) async {
    const scanPause = Duration(seconds: 5);

    final appState = AppState();
    await appState.init();
    await appState.markOnboarded();

    final app = CareConnectApp(appState: appState);
    await tester.pumpWidget(app);
    await tester.pumpAndSettle(const Duration(seconds: 1));

    const routes = <String>['/home', '/schedule'];

    for (final route in routes) {
      app.router.go(route);
      await tester.pumpAndSettle(const Duration(seconds: 1));
      // ignore: avoid_print
      print('A11Y_SCAN_READY:$route');
      await Future<void>.delayed(scanPause);
    }
  });
}
