import 'package:flutter/material.dart';
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

  const CareConnectApp({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: appState,
      child: Builder(
        builder: (context) {
          final router = createAppRouter(
            context.read<AppState>(),
          );
          return MaterialApp.router(
            title: 'CareConnect',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.light,
            routerConfig: router,
          );
        },
      ),
    );
  }
}
