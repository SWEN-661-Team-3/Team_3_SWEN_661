import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_card.dart';

class TodaysPlanScreen extends StatelessWidget {
  const TodaysPlanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final nextTask = appState.todaysPlan.firstWhere(
      (a) => a.status != 'done',
      orElse: () => appState.todaysPlan.first,
    );

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    RichText(
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppColors.heading,
                          height: 1.4,
                        ),
                        children: [
                          TextSpan(text: 'Your setup is complete.\n'),
                          TextSpan(
                            text: "Here is today's plan.",
                            style: TextStyle(color: AppColors.primaryAction),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    _buildHeroCard(context, nextTask),
                    const SizedBox(height: 16),
                    LayoutBuilder(
                      builder: (context, constraints) {
                        if (constraints.maxWidth > 500) {
                          return Row(
                            children: [
                              Expanded(child: _buildHelperCard(appState)),
                              const SizedBox(width: 16),
                              Expanded(child: _buildTodayCard(appState)),
                            ],
                          );
                        }
                        return Column(
                          children: [
                            _buildHelperCard(appState),
                            const SizedBox(height: 16),
                            _buildTodayCard(appState),
                          ],
                        );
                      },
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
            _buildBottomBar(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(bottom: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.blueBg,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.favorite, color: AppColors.primaryAction, size: 24),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'CareConnect',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: AppColors.heading,
              ),
            ),
          ),
          SizedBox(
            width: 48,
            height: 48,
            child: Material(
              color: AppColors.subtleBg,
              borderRadius: BorderRadius.circular(16),
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () => context.push('/setup'),
                child: const Icon(Icons.settings, color: AppColors.heading, size: 24),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroCard(BuildContext context, dynamic nextTask) {
    return GestureDetector(
      onTap: () => context.push('/details'),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppColors.primaryAction,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: AppColors.primaryAction, width: 4),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryAction.withValues(alpha: 0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
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
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.notifications, color: AppColors.white, size: 16),
                  SizedBox(width: 6),
                  Text(
                    'Up Next',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.white,
                      letterSpacing: 1.2,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text(
              nextTask.title,
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: AppColors.white,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${nextTask.time} \u2022 ${nextTask.location.isEmpty ? "Home" : nextTask.location}',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppColors.white.withValues(alpha: 0.8),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Tap to see details',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.white.withValues(alpha: 0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHelperCard(AppState appState) {
    final helper = appState.caregivers.isNotEmpty
        ? appState.caregivers.first.name
        : 'No helper';
    return CareCard(
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.successBg,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.person, color: AppColors.success, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$helper is available',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.heading,
                  ),
                ),
                const Text(
                  'Helper',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.mutedText,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTodayCard(AppState appState) {
    final pending = appState.todaysPlan.where((a) => a.status != 'done').length;
    return CareCard(
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.warningBg,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.calendar_today, color: AppColors.warningDark, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$pending Appointments',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.heading,
                  ),
                ),
                const Text(
                  'Today',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.mutedText,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton(
          onPressed: () => context.push('/setup'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.blueBg,
            foregroundColor: AppColors.primaryAction,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          child: const Text(
            'Accessibility Shortcuts',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
        ),
      ),
    );
  }
}
