import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/reminder.dart';
import '../theme/app_colors.dart';
import '../widgets/care_card.dart';
import '../widgets/bottom_nav_bar.dart';
import '../widgets/icon_badge.dart';

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
    final appState = context.watch<AppState>();

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
                            _buildNextAppointment(appState),
                            const SizedBox(height: 48),
                            _buildReminders(appState),
                          ],
                        );
                      }
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(child: _buildNextAppointment(appState)),
                          const SizedBox(width: 24),
                          Expanded(child: _buildReminders(appState)),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  _buildDailyTasks(appState),
                  const SizedBox(height: 32),
                  _buildQuickLinks(context),
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
        onFullPlan: () => context.push('/full-plan'),
        onSettings: () => context.push('/setup'),
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
                  const Expanded(
                    child: Text(
                      'CareConnect',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: AppColors.heading,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  Semantics(
                    label: 'Emergency help',
                    button: true,
                    child: SizedBox(
                      width: 48,
                      height: 48,
                      child: Material(
                        color: AppColors.emergency,
                        borderRadius: BorderRadius.circular(16),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(16),
                          onTap: () => context.push('/emergency'),
                          child: const Icon(
                            Icons.emergency,
                            size: 28,
                            color: AppColors.white,
                            semanticLabel: 'Emergency help',
                          ),
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
                  Flexible(
                    child: Text(
                      _formattedDate.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 2,
                        color: AppColors.heading,
                      ),
                      overflow: TextOverflow.ellipsis,
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

  Widget _buildNextAppointment(AppState appState) {
    final nextAppt = appState.nextAppointment;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionHeading('Next Appointment', AppColors.primaryAction),
        const SizedBox(height: 16),
        if (nextAppt == null)
          CareCard(
            backgroundColor: AppColors.successBg,
            borderColor: AppColors.success,
            borderRadius: 40,
            child: Row(
              children: [
                IconBadge(icon: Icons.check_circle, color: AppColors.success, padding: 10),
                const SizedBox(width: 16),
                const Expanded(
                  child: Text(
                    'All Done!',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: AppColors.success,
                    ),
                  ),
                ),
              ],
            ),
          )
        else
          _buildNextAppointmentHero(context, nextAppt),
      ],
    );
  }

  Widget _buildReminders(AppState appState) {
    final reminders = appState.pendingReminders;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionHeading('Upcoming Reminders', AppColors.warning),
        const SizedBox(height: 16),
        if (reminders.isEmpty)
          CareCard(
            child: Text(
              'No pending reminders',
              style: TextStyle(fontSize: 18, color: AppColors.mutedText),
            ),
          )
        else
          ...reminders.asMap().entries.expand((entry) sync* {
            if (entry.key > 0) yield const SizedBox(height: 12);
            yield _reminderItem(entry.value);
          }),
      ],
    );
  }

  Widget _reminderItem(Reminder reminder) {
    final isHydration = reminder.type == 'hydration';
    final label =
        '${reminder.title}. ${reminder.dueTime.toUpperCase()}. Open reminder.';
    return Semantics(
      button: true,
      label: label,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => context.push('/notification?reminderId=${reminder.id}'),
        child: Container(
          constraints: const BoxConstraints(minHeight: 72),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(36),
          ),
          child: Row(
            children: [
              IconBadge(
                icon: isHydration ? Icons.water_drop : Icons.medication,
                color: isHydration ? AppColors.primaryAction : AppColors.warningDark,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      reminder.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppColors.heading,
                      ),
                    ),
                    Text(
                      reminder.dueTime.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 16,
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
        ),
      ),
    );
  }

  Widget _buildDailyTasks(AppState appState) {
    final nextId = appState.nextAppointment?.id;
    final tasks = appState.todaysPlan
        .where((task) => task.id != nextId)
        .take(3)
        .toList();

    return ExcludeSemantics(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionHeading('Daily Health Tasks', AppColors.success),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(36),
              border: Border.all(color: AppColors.success, width: 4),
            ),
            child: Column(
              children: [
                for (var i = 0; i < tasks.length; i++) ...[
                  if (i > 0) const SizedBox(height: 12),
                  _taskItem(tasks[i].title, tasks[i].status == 'done'),
                ],
              ],
            ),
          ),
        ],
      ),
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
            IconBadge(icon: Icons.check_circle, color: AppColors.success, padding: 6, iconSize: 24)
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
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: completed ? AppColors.heading : AppColors.mutedText,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickLinks(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionHeading('Quick Links', AppColors.caregiver),
        const SizedBox(height: 16),
        _quickLinkTile(context, Icons.history, 'Activity Log', '/activity-log', AppColors.primaryAction),
        const SizedBox(height: 8),
        _quickLinkTile(context, Icons.calendar_month, 'My Schedule', '/schedule', AppColors.caregiver),
        const SizedBox(height: 8),
        _quickLinkTile(context, Icons.tune, 'Reminder Preferences', '/reminder-preferences', AppColors.primaryAction),
        const SizedBox(height: 8),
        _quickLinkTile(context, Icons.notifications_off, 'Notification Settings', '/notification-warning', AppColors.warningDark),
      ],
    );
  }

  Widget _quickLinkTile(
    BuildContext context,
    IconData icon,
    String label,
    String route,
    Color iconColor,
  ) {
    return Semantics(
      button: true,
      label: label,
      child: GestureDetector(
        onTap: () => context.push(route),
        child: CareCard(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Row(
            children: [
              IconBadge(icon: icon, color: iconColor, padding: 8, iconSize: 22, borderRadius: 12),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.heading,
                  ),
                ),
              ),
              const Icon(Icons.chevron_right, size: 24, color: AppColors.disabledText),
            ],
          ),
        ),
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
                Icon(Icons.refresh, size: 18, color: AppColors.mutedText),
                SizedBox(width: 10),
                Text(
                  'Last Updated: Just now',
                  style: TextStyle(
                    fontSize: 16,
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
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.mutedText),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildNextAppointmentHero(BuildContext context, dynamic nextAppt) {
    final location = nextAppt.location.isEmpty ? 'Home' : nextAppt.location;
    return Semantics(
      button: true,
      label:
          'Next appointment, ${nextAppt.title}, ${nextAppt.time}, $location. View details.',
      child: GestureDetector(
        onTap: () => context.push('/details?id=${nextAppt.id}'),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppColors.primaryAction,
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: AppColors.primaryAction, width: 4),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'TODAY @ ${nextAppt.time}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                nextAppt.title,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: AppColors.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${nextAppt.time} \u2022 $location',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: AppColors.white,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'View details',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionHeading(String text, Color barColor) {
    return Semantics(
      header: true,
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w900,
          color: AppColors.heading,
        ),
      ),
    );
  }
}
