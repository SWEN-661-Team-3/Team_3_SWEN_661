import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';

class SuccessScreen extends StatelessWidget {
  final String type;
  final String title;

  const SuccessScreen({
    super.key,
    this.type = 'complete',
    this.title = 'Task',
  });

  @override
  Widget build(BuildContext context) {
    final config = _typeConfig();

    return Scaffold(
      backgroundColor: config.bg,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: config.iconBg,
                          shape: BoxShape.circle,
                          border: Border.all(color: config.iconBorder, width: 6),
                        ),
                        child: Icon(config.icon, size: 64, color: config.iconColor),
                      ),
                      const SizedBox(height: 32),
                      Text(
                        config.status,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.5,
                          color: config.iconBg,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        config.heading,
                        style: const TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          color: AppColors.heading,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        config.message(title),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                          color: AppColors.mutedText,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 40),
                      LayoutBuilder(
                        builder: (context, constraints) {
                          final buttons = [
                            _navButton(
                              context, 'Return to Home', '/home',
                              primary: true,
                              color: config.iconBg,
                            ),
                            const SizedBox(width: 16, height: 16),
                            _navButton(
                              context, "Return to Today's Plan", '/todays-plan',
                              primary: false,
                              color: config.iconColor,
                            ),
                          ];

                          if (constraints.maxWidth > 500) {
                            return Row(children: [
                              Expanded(child: buttons[0]),
                              buttons[1],
                              Expanded(child: buttons[2]),
                            ]);
                          }
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: buttons,
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Action Recorded Securely',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: config.iconColor.withValues(alpha: 0.7),
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _navButton(
    BuildContext context,
    String label,
    String path, {
    bool primary = false,
    Color? color,
  }) {
    if (primary) {
      return SizedBox(
        width: double.infinity,
        height: 60,
        child: ElevatedButton(
          onPressed: () => context.go(path),
          style: ElevatedButton.styleFrom(
            backgroundColor: color ?? AppColors.primaryAction,
            foregroundColor: AppColors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
          ),
          child: Text(
            label,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
        ),
      );
    }
    return SizedBox(
      width: double.infinity,
      height: 60,
      child: OutlinedButton(
        onPressed: () => context.go(path),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.heading,
          side: const BorderSide(color: AppColors.primary, width: 3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }

  _SuccessConfig _typeConfig() {
    switch (type) {
      case 'snooze':
        return _SuccessConfig(
          bg: AppColors.warningBg,
          iconBg: AppColors.warningDark,
          iconBorder: AppColors.warningDark,
          iconColor: AppColors.warningLight,
          icon: Icons.snooze,
          status: 'SNOOZED',
          heading: 'Reminder Snoozed',
          message: (t) => '$t reminder snoozed for 1 hour.',
        );
      case 'postpone':
        return _SuccessConfig(
          bg: AppColors.purpleBg,
          iconBg: AppColors.purpleLight,
          iconBorder: AppColors.purpleLight,
          iconColor: AppColors.caregiver,
          icon: Icons.schedule,
          status: 'POSTPONED',
          heading: 'Task Postponed',
          message: (t) => '$t has been moved to a later time.',
        );
      default:
        return _SuccessConfig(
          bg: AppColors.successBg,
          iconBg: AppColors.successLight,
          iconBorder: AppColors.successLight,
          iconColor: AppColors.success,
          icon: Icons.check_circle,
          status: 'COMPLETE',
          heading: 'Task Complete',
          message: (t) => '$t marked as complete.',
        );
    }
  }
}

class _SuccessConfig {
  final Color bg;
  final Color iconBg;
  final Color iconBorder;
  final Color iconColor;
  final IconData icon;
  final String status;
  final String heading;
  final String Function(String) message;

  const _SuccessConfig({
    required this.bg,
    required this.iconBg,
    required this.iconBorder,
    required this.iconColor,
    required this.icon,
    required this.status,
    required this.heading,
    required this.message,
  });
}
