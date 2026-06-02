import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';
import 'screens/emergency_screen.dart';
import 'screens/activity_log_screen.dart';
import 'screens/details_screen.dart';

void main() {
  runApp(const CareConnectApp());
}

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CareConnect',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      initialRoute: '/',
      routes: {
        '/': (_) => const HomeScreen(),
        '/emergency': (_) => const EmergencyScreen(),
        '/emergency-confirmed': (_) => const EmergencyConfirmedScreen(),
        '/activity-log': (_) => const ActivityLogScreen(),
        '/details': (_) => const DetailsScreen(),
      },
    );
  }
}
