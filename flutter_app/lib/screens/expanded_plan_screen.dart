import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/appointment.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';

class ExpandedPlanScreen extends StatelessWidget {
  const ExpandedPlanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final plan = appState.todaysPlan;
    final completed = plan.where((a) => a.status == 'done').length;

    final morning = plan.where((a) => _timeGroup(a.time) == 'morning').toList();
    final afternoon = plan.where((a) => _timeGroup(a.time) == 'afternoon').toList();
    final evening = plan.where((a) => _timeGroup(a.time) == 'evening').toList();

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Your Full Plan',
            subtitle: 'Today',
            onBack: () => context.pop(),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (morning.isNotEmpty)
                    _buildGroup('Morning', morning, context),
                  if (afternoon.isNotEmpty)
                    _buildGroup('Afternoon', afternoon, context),
                  if (evening.isNotEmpty)
                    _buildGroup('Evening', evening, context),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
          _buildProgressFooter(completed, plan.length),
        ],
      ),
    );
  }

  String _timeGroup(String time) {
    final hour = _parseHour(time);
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  int _parseHour(String time) {
    final parts = time.split(':');
    var hour = int.tryParse(parts[0]) ?? 8;
    if (time.toUpperCase().contains('PM') && hour != 12) hour += 12;
    if (time.toUpperCase().contains('AM') && hour == 12) hour = 0;
    return hour;
  }

  Widget _buildGroup(String title, List<Appointment> items, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title.toUpperCase(),
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.5,
              color: AppColors.mutedText,
            ),
          ),
          const SizedBox(height: 12),
          ...items.map((item) => _buildPlanItem(item, context)),
        ],
      ),
    );
  }

  Widget _buildPlanItem(Appointment item, BuildContext context) {
    final isDone = item.status == 'done';
    final typeColor = _typeColor(item.type);
    final typeBg = _typeBg(item.type);
    final typeIcon = _typeIcon(item.type);

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () => context.push('/details?id=${item.id}'),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppColors.border, width: 3),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: typeBg,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(typeIcon, color: typeColor, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: typeBg,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            item.time,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: typeColor,
                            ),
                          ),
                        ),
                        _statusBadge(isDone),
                        if (item.actionLabel != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                            decoration: BoxDecoration(
                              color: isDone ? AppColors.subtleBg : AppColors.blueBg,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              item.actionLabel!,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: isDone ? AppColors.mutedText : AppColors.primaryAction,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: isDone ? AppColors.mutedText : AppColors.heading,
                        decoration: isDone ? TextDecoration.lineThrough : null,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statusBadge(bool isDone) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isDone ? AppColors.successBg : AppColors.blueBg,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        isDone ? 'Done' : 'To Do',
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: isDone ? AppColors.success : AppColors.primaryAction,
        ),
      ),
    );
  }

  Color _typeColor(String type) {
    switch (type) {
      case 'appointment':
        return AppColors.caregiver;
      case 'health-task':
        return AppColors.success;
      default:
        return AppColors.primaryAction;
    }
  }

  Color _typeBg(String type) {
    switch (type) {
      case 'appointment':
        return AppColors.purpleBg;
      case 'health-task':
        return AppColors.successBg;
      default:
        return AppColors.blueBg;
    }
  }

  IconData _typeIcon(String type) {
    switch (type) {
      case 'appointment':
        return Icons.event;
      case 'health-task':
        return Icons.favorite;
      default:
        return Icons.medication;
    }
  }

  Widget _buildProgressFooter(int completed, int total) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '$completed of $total tasks',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.heading,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: total > 0 ? completed / total : 0,
                      minHeight: 12,
                      backgroundColor: AppColors.subtleBg,
                      color: AppColors.primaryAction,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
