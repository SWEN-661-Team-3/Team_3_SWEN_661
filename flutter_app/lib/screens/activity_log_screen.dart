import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';
import '../widgets/status_badge.dart';

enum ActivityType { medication, appointment, alert }

class ActivityEntry {
  final String title;
  final String time;
  final ActivityType type;
  final BadgeType status;

  const ActivityEntry({
    required this.title,
    required this.time,
    required this.type,
    required this.status,
  });
}

class ActivityLogScreen extends StatefulWidget {
  const ActivityLogScreen({super.key});

  @override
  State<ActivityLogScreen> createState() => _ActivityLogScreenState();
}

class _ActivityLogScreenState extends State<ActivityLogScreen> {
  String _activeFilter = 'All';

  static const _filters = ['All', 'Meds', 'Appts', 'Alerts'];

  static const _todayEntries = [
    ActivityEntry(
      title: 'Blood Pressure Medicine',
      time: '9:00 AM',
      type: ActivityType.medication,
      status: BadgeType.done,
    ),
    ActivityEntry(
      title: 'Heart Clinic Follow-up',
      time: '10:30 AM',
      type: ActivityType.appointment,
      status: BadgeType.done,
    ),
    ActivityEntry(
      title: 'Emergency Help Request',
      time: '2:15 PM',
      type: ActivityType.alert,
      status: BadgeType.sent,
    ),
  ];

  static const _yesterdayEntries = [
    ActivityEntry(
      title: 'Morning Vitamins',
      time: '8:00 AM',
      type: ActivityType.medication,
      status: BadgeType.done,
    ),
    ActivityEntry(
      title: 'Afternoon Medication',
      time: '12:30 PM',
      type: ActivityType.medication,
      status: BadgeType.missed,
    ),
  ];

  List<ActivityEntry> _filter(List<ActivityEntry> entries) {
    if (_activeFilter == 'All') return entries;
    final type = switch (_activeFilter) {
      'Meds' => ActivityType.medication,
      'Appts' => ActivityType.appointment,
      'Alerts' => ActivityType.alert,
      _ => null,
    };
    if (type == null) return entries;
    return entries.where((e) => e.type == type).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Activity Log',
            onBack: () => context.canPop() ? context.pop() : context.go('/home'),
            onAccessibility: () => context.push('/setup'),
          ),
          _buildFilterRow(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  _buildDateGroup('Today, May 27', _filter(_todayEntries)),
                  const SizedBox(height: 24),
                  _buildDateGroup('Yesterday, May 26', _filter(_yesterdayEntries)),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterRow() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(bottom: BorderSide(color: AppColors.border, width: 2)),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Row(
          children: _filters.map((filter) {
            final isActive = _activeFilter == filter;
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: SizedBox(
                height: 40,
                child: FilterChip(
                  selected: isActive,
                  label: Text(
                    filter,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      color: isActive ? AppColors.white : AppColors.heading,
                    ),
                  ),
                  onSelected: (_) => setState(() => _activeFilter = filter),
                  backgroundColor: AppColors.white,
                  selectedColor: AppColors.primaryAction,
                  side: BorderSide(
                    color: isActive ? AppColors.primaryAction : AppColors.border,
                    width: isActive ? 0 : 2,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  showCheckmark: false,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildDateGroup(String label, List<ActivityEntry> entries) {
    if (entries.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 4,
              height: 24,
              decoration: BoxDecoration(
                color: AppColors.primaryAction,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              label,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: AppColors.heading,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ...entries.map((entry) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: _buildEntryCard(entry),
        )),
      ],
    );
  }

  Widget _buildEntryCard(ActivityEntry entry) {
    final (icon, iconBg, iconColor) = switch (entry.type) {
      ActivityType.medication => (Icons.medication, AppColors.warningLight, AppColors.warningDark),
      ActivityType.appointment => (Icons.calendar_today, AppColors.blueLight, AppColors.primaryAction),
      ActivityType.alert => (Icons.notifications, AppColors.emergencyBg, AppColors.emergency),
    };

    return CareCard(
      padding: const EdgeInsets.all(20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, size: 28, color: iconColor),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: AppColors.heading,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  entry.time,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.5,
                    color: AppColors.mutedText,
                  ),
                ),
                const SizedBox(height: 8),
                StatusBadge(type: entry.status),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
