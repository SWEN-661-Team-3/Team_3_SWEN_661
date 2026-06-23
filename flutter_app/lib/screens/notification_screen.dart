import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../models/reminder.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_card.dart';
import '../widgets/icon_badge.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final reminderId = GoRouterState.of(context).uri.queryParameters['reminderId'];
    final appState = context.watch<AppState>();
    Reminder? reminder;
    if (reminderId != null) {
      for (final r in appState.reminders) {
        if (r.id == reminderId) {
          reminder = r;
          break;
        }
      }
    }
    reminder ??= appState.pendingReminders.isNotEmpty
        ? appState.pendingReminders.first
        : null;

    return Scaffold(
      backgroundColor: AppColors.pageBg,
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
                      IconBadge(
                        icon: Icons.notifications_active,
                        color: AppColors.warningDark,
                        padding: 26,
                        iconSize: 48,
                        borderRadius: 50,
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'REMINDER',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.5,
                          color: AppColors.warningDark,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        reminder?.title ?? 'Medication Reminder',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: AppColors.heading,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        reminder != null
                            ? '${reminder.title} - Due at ${reminder.dueTime}'
                            : 'No pending reminders',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                          color: AppColors.mutedText,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),
                      if (reminder?.instructions != null)
                        CareCard(
                          backgroundColor: AppColors.warningBg,
                          borderColor: AppColors.warningLight,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Row(
                                children: [
                                  Icon(Icons.info_outline, color: AppColors.warningDark, size: 20),
                                  SizedBox(width: 8),
                                  Text(
                                    'Instructions',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.warningDark,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                reminder!.instructions!,
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: AppColors.heading,
                                  height: 1.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
            _buildActions(context, reminder),
          ],
        ),
      ),
    );
  }

  Widget _buildActions(BuildContext context, Reminder? reminder) {
    final reminderId = reminder?.id;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            height: 60,
            child: ElevatedButton(
              onPressed: reminderId != null
                  ? () => context.push('/reminder-detail?reminderId=$reminderId')
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryAction,
                foregroundColor: AppColors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              child: const Text(
                'View Details',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: OutlinedButton(
                    onPressed: reminderId != null
                        ? () => context.push('/snooze?reminderId=$reminderId')
                        : null,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.heading,
                      side: const BorderSide(color: AppColors.border, width: 3),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      'Snooze',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: reminderId != null
                        ? () {
                            context.read<AppState>().dismissReminder(reminderId);
                            context.go('/reminder-success');
                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      foregroundColor: AppColors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      'Mark Done',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
