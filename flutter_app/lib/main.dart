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
          final isDark = state.settings.theme == 'dark';
          final wideSpacing = state.settings.spacing == 'wide';
          final reduceMotion = state.settings.motion == 'reduced';

          final theme = isHighContrast
              ? AppTheme.highContrast
              : isDark
                  ? AppTheme.dark
                  : AppTheme.light;

          return MaterialApp.router(
            title: 'CareConnect',
            debugShowCheckedModeBanner: false,
            theme: theme,
            routerConfig: _router,
            builder: (context, child) {
              var mediaQuery = MediaQuery.of(context).copyWith(
                textScaler: TextScaler.linear(textScale),
                disableAnimations: reduceMotion,
              );
              if (wideSpacing) {
                mediaQuery = mediaQuery.copyWith(
                  padding: mediaQuery.padding.copyWith(
                    left: mediaQuery.padding.left + 8,
                    right: mediaQuery.padding.right + 8,
                  ),
                );
              }
              return MediaQuery(
                data: mediaQuery,
                child: state.settings.screenReader == 'on'
                    ? Semantics(
                        label: 'CareConnect health companion',
                        child: child!,
                      )
                    : child!,
              );
            },
          );
        },
      ),
    );
  }
}
