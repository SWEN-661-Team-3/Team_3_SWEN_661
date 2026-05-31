import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/care_card.dart';
import '../widgets/care_header.dart';

class DetailsScreen extends StatelessWidget {
  const DetailsScreen({super.key});

  static const _taskDetails = _TaskDetails(
    title: 'Eye Doctor Checkup',
    date: 'Monday, May 25',
    time: '2:00 PM',
    location: 'City Eye Clinic, 123 Vision Way',
    notes:
        'Remember to bring your current glasses and the list of eye drops you use. Dr. Smith will check your intraocular pressure.',
    caregiverVisible: 'Shared with Sarah (Caregiver)',
    reminderStatus: 'Reminder set for 30 minutes before',
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Item Details',
            onBack: () => Navigator.pop(context),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPrimaryInfoCard(),
                  const SizedBox(height: 32),
                  _buildNotesSection(),
                  const SizedBox(height: 32),
                  Wrap(
                    runSpacing: 16,
                    spacing: 16,
                    children: [
                      _buildCompactInfoCard(
                        icon: Icons.visibility,
                        iconColor: AppColors.caregiver,
                        title: 'Visibility',
                        subtitle: _taskDetails.caregiverVisible,
                        backgroundColor: AppColors.purpleBg,
                      ),
                      _buildCompactInfoCard(
                        icon: Icons.notifications,
                        iconColor: AppColors.warningDark,
                        title: 'Reminders',
                        subtitle: _taskDetails.reminderStatus,
                        backgroundColor: AppColors.amberBg,
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  _buildActionButtons(context),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrimaryInfoCard() {
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
            child: const Text(
              'Appointment',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: AppColors.primaryAction,
                letterSpacing: 1.5,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            _taskDetails.title,
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
                value: _taskDetails.date,
              ),
              const SizedBox(height: 18),
              _buildDetailRow(
                icon: Icons.access_time,
                label: 'Time',
                value: _taskDetails.time,
              ),
              const SizedBox(height: 18),
              _buildDetailRow(
                icon: Icons.location_on,
                label: 'Location',
                value: _taskDetails.location,
              ),
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
                  fontSize: 14,
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

  Widget _buildNotesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: const [
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
            _taskDetails.notes,
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
    return SizedBox(
      width: 320,
      child: CareCard(
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
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton.icon(
          onPressed: () {
            Navigator.pop(context);
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
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Snoozed for 1 hour')),
            );
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
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Caregiver message flow not implemented yet')),
            );
          },
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

class _TaskDetails {
  final String title;
  final String date;
  final String time;
  final String location;
  final String notes;
  final String caregiverVisible;
  final String reminderStatus;

  const _TaskDetails({
    required this.title,
    required this.date,
    required this.time,
    required this.location,
    required this.notes,
    required this.caregiverVisible,
    required this.reminderStatus,
  });
}
