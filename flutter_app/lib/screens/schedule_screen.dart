import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';
import '../widgets/icon_badge.dart';
import '../widgets/status_badge.dart';

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final plan = appState.todaysPlan;

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'My Schedule',
            onBack: () => context.pop(),
            onEmergency: () => context.push('/emergency'),
          ),
          Expanded(
            child: plan.isEmpty
                ? const Center(
                    child: Text(
                      'No items scheduled',
                      style: TextStyle(fontSize: 18, color: AppColors.mutedText),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: plan.length,
                    itemBuilder: (context, index) {
                      final item = plan[index];
                      final isDone = item.status == 'done';
                      final isSnoozed = item.status == 'snoozed';
                      final isClosed = isDone || isSnoozed;
                      final badgeType = isDone
                          ? BadgeType.done
                          : isSnoozed
                              ? BadgeType.missed
                              : BadgeType.todo;
                      final statusLabel = isDone
                          ? 'Done'
                          : isSnoozed
                              ? 'Snoozed'
                              : 'To Do';

                      final card = CareCard(
                        child: Row(
                          children: [
                            ExcludeSemantics(
                              child: IconBadge(
                                icon: isDone ? Icons.check_circle : Icons.schedule,
                                color: isDone ? AppColors.success : AppColors.primaryAction,
                                padding: 14,
                                iconSize: 28,
                                borderRadius: 16,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.title,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.heading,
                                      decoration: isClosed ? TextDecoration.lineThrough : null,
                                      decorationColor: AppColors.heading,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    item.time,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      color: AppColors.mutedText,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            ExcludeSemantics(child: StatusBadge(type: badgeType)),
                          ],
                        ),
                      );

                      if (isClosed) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: card,
                        );
                      }

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Semantics(
                          button: true,
                          excludeSemantics: true,
                          label: '${item.title}. ${item.time}. $statusLabel. View details.',
                          onTap: () => context.push('/details?id=${item.id}'),
                          child: GestureDetector(
                            onTap: () => context.push('/details?id=${item.id}'),
                            child: card,
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
