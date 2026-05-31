import 'dart:async';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/care_card.dart';
import '../widgets/bottom_nav_bar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Timer _timer;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String get _formattedDate {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return '${days[_now.weekday - 1]}, ${months[_now.month - 1]} ${_now.day}';
  }

  String get _formattedTime {
    final hour = _now.hour % 12 == 0 ? 12 : _now.hour % 12;
    final minute = _now.minute.toString().padLeft(2, '0');
    final period = _now.hour >= 12 ? 'PM' : 'AM';
    return '$hour:$minute $period';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final isNarrow = constraints.maxWidth < 800;
                      if (isNarrow) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildNextAppointment(),
                            const SizedBox(height: 32),
                            _buildReminders(),
                          ],
                        );
                      }
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(child: _buildNextAppointment()),
                          const SizedBox(width: 24),
                          Expanded(child: _buildReminders()),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  _buildDailyTasks(),
                  const SizedBox(height: 32),
                  _buildLastUpdated(),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: CareBottomNavBar(
        onFullPlan: () => Navigator.pushNamed(context, '/full-plan'),
        onSettings: () => Navigator.pushNamed(context, '/settings'),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          bottom: BorderSide(color: AppColors.border, width: 4),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.favorite, color: AppColors.emergency, size: 32),
                  const SizedBox(width: 12),
                  const Text(
                    'CareConnect',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: AppColors.heading,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const Spacer(),
                  SizedBox(
                    width: 48,
                    height: 48,
                    child: Material(
                      color: AppColors.blueBg,
                      borderRadius: BorderRadius.circular(16),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () => Navigator.pushNamed(context, '/emergency'),
                        child: const Icon(
                          Icons.emergency,
                          size: 28,
                          color: AppColors.emergency,
                          semanticLabel: 'Emergency help',
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 20, color: AppColors.heading),
                  const SizedBox(width: 8),
                  Text(
                    _formattedDate.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2,
                      color: AppColors.heading,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                _formattedTime,
                style: const TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.w900,
                  color: AppColors.heading,
                  letterSpacing: -1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNextAppointment() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionHeading('Next Appointment', AppColors.primaryAction),
        const SizedBox(height: 16),
        CareCard(
          borderColor: AppColors.primaryActionDark,
          backgroundColor: AppColors.primaryAction,
          borderRadius: 40,
          onTap: () => Navigator.pushNamed(context, '/details'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primaryActionDark.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'TODAY @ 2:00 PM',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                        color: AppColors.white,
                      ),
                    ),
                  ),
                  const Icon(Icons.medical_services, size: 32, color: AppColors.white),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'Eye Exam',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w900,
                  color: AppColors.white,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'City Health Center',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Color(0xBBFFFFFF),
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.only(top: 12),
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(color: Color(0x44FFFFFF), width: 2),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'View Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.white,
                      ),
                    ),
                    Icon(Icons.chevron_right, size: 28, color: AppColors.white),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildReminders() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionHeading('Upcoming Reminders', AppColors.warning),
        const SizedBox(height: 16),
        _reminderItem(
          icon: Icons.medication,
          iconBg: AppColors.warningLight,
          iconColor: AppColors.warningDark,
          title: 'Afternoon Medication',
          subtitle: 'DUE AT 12:30 PM',
        ),
        const SizedBox(height: 12),
        _reminderItem(
          icon: Icons.water_drop,
          iconBg: AppColors.blueLight,
          iconColor: AppColors.primaryAction,
          title: 'Hydration Check',
          subtitle: 'EVERY 2 HOURS',
        ),
      ],
    );
  }

  Widget _reminderItem({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String subtitle,
  }) {
    return CareCard(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: iconBg, width: 2),
            ),
            child: Icon(icon, size: 28, color: iconColor),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: AppColors.heading,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.5,
                    color: AppColors.mutedText,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, size: 24, color: AppColors.disabledText),
        ],
      ),
    );
  }

  Widget _buildDailyTasks() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionHeading('Daily Health Tasks', AppColors.success),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.successBg,
            borderRadius: BorderRadius.circular(36),
            border: Border.all(color: AppColors.successLight, width: 4),
          ),
          child: Column(
            children: [
              _taskItem('Morning Vitamins', true),
              const SizedBox(height: 12),
              _taskItem('Blood Pressure Reading', false),
            ],
          ),
        ),
      ],
    );
  }

  Widget _taskItem(String label, bool completed) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: completed ? AppColors.white : AppColors.subtleBg.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: completed ? AppColors.successLight : AppColors.border,
          width: 2,
        ),
      ),
      child: Row(
        children: [
          if (completed)
            const Icon(Icons.check_circle, size: 28, color: AppColors.success)
          else
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.disabledText, width: 3),
              ),
            ),
          const SizedBox(width: 12),
          Text(
            label,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: completed ? AppColors.heading : AppColors.mutedText,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLastUpdated() {
    return Center(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border, width: 2),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.refresh, size: 16, color: AppColors.mutedText),
                SizedBox(width: 8),
                Text(
                  'Last Updated: Just now',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.mutedText,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Data is securely synced with your health provider.',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.mutedText),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _sectionHeading(String text, Color barColor) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 24,
          decoration: BoxDecoration(
            color: barColor,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          text,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: AppColors.heading,
          ),
        ),
      ],
    );
  }
}
