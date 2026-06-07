import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';

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
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: CareCard(
                          onTap: () => context.push('/details?id=${item.id}'),
                          child: Row(
                            children: [
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  color: isDone ? AppColors.successBg : AppColors.blueBg,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Icon(
                                  isDone ? Icons.check_circle : Icons.schedule,
                                  color: isDone ? AppColors.success : AppColors.primaryAction,
                                  size: 28,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.title,
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w700,
                                        color: isDone ? AppColors.mutedText : AppColors.heading,
                                        decoration: isDone ? TextDecoration.lineThrough : null,
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
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: isDone ? AppColors.successBg : AppColors.blueBg,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  isDone ? 'Done' : 'To Do',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: isDone ? AppColors.success : AppColors.primaryAction,
                                  ),
                                ),
                              ),
                            ],
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
