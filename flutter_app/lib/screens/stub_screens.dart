import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';

class _StubScreen extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool showBack;

  const _StubScreen({
    required this.title,
    this.subtitle = 'Coming soon',
    this.showBack = true,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: title,
            onBack: showBack ? () => context.pop() : null,
          ),
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.construction, size: 64, color: AppColors.mutedText),
                    const SizedBox(height: 16),
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 24, fontWeight: FontWeight.w900,
                        color: AppColors.heading,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w700,
                        color: AppColors.mutedText,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Welcome', subtitle: 'Onboarding entry point', showBack: false);
}

class SetupScreen extends StatelessWidget {
  const SetupScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Set Up View');
}

class PreviewScreen extends StatelessWidget {
  const PreviewScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Readability Check');
}

class CaregiverSetupScreen extends StatelessWidget {
  const CaregiverSetupScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Add Help');
}

class ConfirmationScreen extends StatelessWidget {
  const ConfirmationScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: "You're All Set!", showBack: false);
}

class TodaysPlanScreen extends StatelessWidget {
  const TodaysPlanScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: "Today's Plan", showBack: false);
}

class ExpandedPlanScreen extends StatelessWidget {
  const ExpandedPlanScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Your Full Plan');
}

class SuccessScreen extends StatelessWidget {
  final String type;
  final String title;
  const SuccessScreen({super.key, this.type = 'complete', this.title = 'Task'});
  @override
  Widget build(BuildContext context) =>
      _StubScreen(title: 'Success', subtitle: '$title - $type', showBack: false);
}

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Medication Reminder');
}

class ReminderDetailScreen extends StatelessWidget {
  const ReminderDetailScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Reminder Detail');
}

class SnoozeOptionsScreen extends StatelessWidget {
  const SnoozeOptionsScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Snooze Reminder');
}

class ReminderSuccessScreen extends StatelessWidget {
  const ReminderSuccessScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Reminder Complete', showBack: false);
}

class MissedReminderScreen extends StatelessWidget {
  const MissedReminderScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Missed Task');
}

class CaregiverHelpScreen extends StatelessWidget {
  const CaregiverHelpScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Ask for Help');
}

class NotificationWarningScreen extends StatelessWidget {
  const NotificationWarningScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Notifications');
}

class ReminderPreferencesScreen extends StatelessWidget {
  const ReminderPreferencesScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Reminder Settings');
}

class EmergencyCountdownScreen extends StatelessWidget {
  const EmergencyCountdownScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Emergency Countdown', showBack: false);
}

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'My Schedule');
}
