import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/appointment.dart';
import '../theme/app_colors.dart';
import '../widgets/care_card.dart';
import '../widgets/care_header.dart';

class DetailsScreen extends StatelessWidget {
  const DetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final id = GoRouterState.of(context).uri.queryParameters['id'];
    final appState = context.watch<AppState>();
    final appointment = _resolveAppointment(id, appState);

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Item Details',
            onBack: () => context.canPop() ? context.pop() : context.go('/home'),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPrimaryInfoCard(appointment),
                  const SizedBox(height: 32),
                  if (appointment.notes.isNotEmpty)
                    _buildNotesSection(appointment.notes),
                  if (appointment.notes.isNotEmpty)
                    const SizedBox(height: 32),
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final cards = [
                        _buildCompactInfoCard(
                          icon: Icons.visibility,
                          iconColor: AppColors.caregiver,
                          title: 'Visibility',
                          subtitle: 'Shared with Sarah (Caregiver)',
                          backgroundColor: AppColors.purpleBg,
                        ),
                        _buildCompactInfoCard(
                          icon: Icons.notifications,
                          iconColor: AppColors.warningDark,
                          title: 'Reminders',
                          subtitle: 'Reminder set for 30 minutes before',
                          backgroundColor: AppColors.amberBg,
                        ),
                      ];
                      if (constraints.maxWidth > 600) {
                        return Row(
                          children: [
                            Expanded(child: cards[0]),
                            const SizedBox(width: 16),
                            Expanded(child: cards[1]),
                          ],
                        );
                      }
                      return Column(
                        children: [
                          cards[0],
                          const SizedBox(height: 16),
                          cards[1],
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  _buildActionButtons(context, appointment),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Appointment _resolveAppointment(String? id, AppState appState) {
    if (id != null) {
      final match = appState.todaysPlan.where((a) => a.id == id);
      if (match.isNotEmpty) return match.first;
    }
    final nextTodo = appState.todaysPlan.where((a) => a.status != 'done');
    if (nextTodo.isNotEmpty) return nextTodo.first;
    return appState.todaysPlan.first;
  }

  Widget _buildPrimaryInfoCard(Appointment appointment) {
    return CareCard(
      borderRadius: 44,
      borderColor: AppColors.border,
      backgroundColor: AppColors.white,
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.blueBg,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Text(
              appointment.type.toUpperCase(),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: AppColors.primaryAction,
                letterSpacing: 1.5,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            appointment.title,
            style: const TextStyle(
              fontSize: 42,
              fontWeight: FontWeight.w900,
              color: AppColors.heading,
              height: 1.05,
            ),
          ),
          const SizedBox(height: 28),
          Column(
            children: [
              _buildDetailRow(
                icon: Icons.calendar_today,
                label: 'Date',
                value: appointment.date,
              ),
              const SizedBox(height: 18),
              _buildDetailRow(
                icon: Icons.access_time,
                label: 'Time',
                value: appointment.time,
              ),
              if (appointment.location.isNotEmpty) ...[
                const SizedBox(height: 18),
                _buildDetailRow(
                  icon: Icons.location_on,
                  label: 'Location',
                  value: appointment.location,
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppColors.subtleBg,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Icon(icon, size: 28, color: AppColors.heading),
        ),
        const SizedBox(width: 18),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label.toUpperCase(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  color: AppColors.mutedText,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppColors.heading,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNotesSection(String notes) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.article, size: 32, color: AppColors.primaryAction),
            SizedBox(width: 12),
            Text(
              'Important Notes',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: AppColors.heading,
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),
        CareCard(
          borderRadius: 36,
          borderColor: AppColors.border,
          backgroundColor: AppColors.white,
          padding: const EdgeInsets.all(28),
          child: Text(
            notes,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.mutedText,
              height: 1.5,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCompactInfoCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required Color backgroundColor,
  }) {
    return CareCard(
        borderRadius: 36,
        borderColor: AppColors.border,
        backgroundColor: backgroundColor,
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 28, color: iconColor),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: AppColors.heading,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.mutedText,
              ),
            ),
          ],
        ),
    );
  }

  Widget _buildActionButtons(BuildContext context, Appointment appointment) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton.icon(
          onPressed: () {
            context.read<AppState>().completeTask(appointment.id);
            context.go('/success?type=complete&title=${Uri.encodeComponent(appointment.title)}');
          },
          icon: const Icon(Icons.check_circle, size: 28),
          label: const Padding(
            padding: EdgeInsets.symmetric(vertical: 18),
            child: Text(
              'Mark Complete',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryAction,
            foregroundColor: AppColors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(40),
            ),
            elevation: 8,
          ),
        ),
        const SizedBox(height: 18),
        OutlinedButton.icon(
          onPressed: () {
            context.go('/success?type=snooze&title=${Uri.encodeComponent(appointment.title)}');
          },
          icon: const Icon(Icons.alarm, size: 24, color: AppColors.warningDark),
          label: const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Text(
              'Snooze for 1 Hour',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.heading),
            ),
          ),
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: AppColors.border, width: 4),
            backgroundColor: AppColors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(36),
            ),
          ),
        ),
        const SizedBox(height: 18),
        OutlinedButton.icon(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Edit details screen not implemented yet')), 
            );
          },
          icon: const Icon(Icons.edit, size: 24, color: AppColors.primaryAction),
          label: const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Text(
              'Edit Details',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.heading),
            ),
          ),
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: AppColors.border, width: 4),
            backgroundColor: AppColors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(36),
            ),
          ),
        ),
        const SizedBox(height: 18),
        ElevatedButton.icon(
          onPressed: () => context.push('/caregiver-help'),
          icon: const Icon(Icons.message, size: 28),
          label: const Padding(
            padding: EdgeInsets.symmetric(vertical: 18),
            child: Text(
              'Ask Caregiver',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.caregiver,
            foregroundColor: AppColors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(40),
            ),
            elevation: 8,
          ),
        ),
      ],
    );
  }
}
