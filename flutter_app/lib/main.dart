import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final appState = AppState();
  await appState.init();

  runApp(CareConnectApp(appState: appState));
}

class CareConnectApp extends StatelessWidget {
  final AppState appState;
  late final GoRouter _router = createAppRouter(appState);

  CareConnectApp({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: appState,
      child: Consumer<AppState>(
        builder: (context, state, _) {
          final textScale = switch (state.settings.textSize) {
            'extra-large' => 1.3,
            'large' => 1.15,
            _ => 1.0,
          };
          final isHighContrast = state.settings.contrast == 'high';

          return MaterialApp.router(
            title: 'CareConnect',
            debugShowCheckedModeBanner: false,
            theme: isHighContrast ? AppTheme.highContrast : AppTheme.light,
            routerConfig: _router,
            builder: (context, child) {
              return MediaQuery(
                data: MediaQuery.of(context).copyWith(
                  textScaler: TextScaler.linear(textScale),
                ),
                child: child!,
              );
            },
          );
        },
      ),
    );
  }
}
