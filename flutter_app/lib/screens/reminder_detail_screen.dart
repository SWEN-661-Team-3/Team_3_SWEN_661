import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';

class ReminderDetailScreen extends StatelessWidget {
  const ReminderDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final reminder = appState.reminders.isNotEmpty ? appState.reminders.first : null;

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Reminder Detail',
            onBack: () => context.pop(),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CareCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.blueBg,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text(
                            'Medication',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primaryAction,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          reminder?.title ?? 'Medication Reminder',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: AppColors.heading,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.access_time, color: AppColors.mutedText, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              reminder?.dueTime ?? '9:00 AM Today',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                                color: AppColors.mutedText,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  if (reminder?.instructions != null) ...[
                    const SizedBox(height: 16),
                    CareCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.description, color: AppColors.primaryAction, size: 20),
                              SizedBox(width: 8),
                              Text(
                                'Instructions',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.heading,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
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
                  if (reminder?.relatedAppointment != null) ...[
                    const SizedBox(height: 16),
                    CareCard(
                      backgroundColor: AppColors.blueBg,
                      borderColor: AppColors.blueLight,
                      child: Row(
                        children: [
                          const Icon(Icons.link, color: AppColors.primaryAction, size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Related Appointment',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.mutedText,
                                  ),
                                ),
                                Text(
                                  reminder!.relatedAppointment!,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.heading,
                                  ),
                                ),
                                if (reminder.relatedAppointmentTime != null)
                                  Text(
                                    reminder.relatedAppointmentTime!,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      color: AppColors.mutedText,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
          _buildActions(context, appState),
        ],
      ),
    );
  }

  Widget _buildActions(BuildContext context, AppState appState) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          children: [
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton(
                onPressed: () {
                  if (appState.reminders.isNotEmpty) {
                    appState.dismissReminder(appState.reminders.first.id);
                  }
                  context.go('/reminder-success');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.success,
                  foregroundColor: AppColors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                child: const Text(
                  'Mark Complete',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: OutlinedButton(
                onPressed: () => context.push('/snooze'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.heading,
                  side: const BorderSide(color: AppColors.border, width: 3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                child: const Text(
                  'Snooze Reminder',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
