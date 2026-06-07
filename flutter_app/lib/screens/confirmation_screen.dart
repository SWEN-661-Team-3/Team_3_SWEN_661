import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_card.dart';

class ConfirmationScreen extends StatelessWidget {
  const ConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final labels = appState.settings.activeLabels;

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    const SizedBox(height: 40),
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: AppColors.successBg,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.successLight, width: 6),
                      ),
                      child: const Icon(
                        Icons.check_circle,
                        size: 64,
                        color: AppColors.success,
                      ),
                    ),
                    const SizedBox(height: 32),
                    const Text(
                      "You're all set!",
                      style: TextStyle(
                        fontSize: 40,
                        fontWeight: FontWeight.w900,
                        color: AppColors.heading,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Your preferences are saved. You can change them anytime in your profile.',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                        color: AppColors.mutedText,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    CareCard(
                      backgroundColor: AppColors.pageBg,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: AppColors.blueBg,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: const Icon(
                                  Icons.settings,
                                  color: AppColors.primaryAction,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: 12),
                              const Expanded(
                                child: Text(
                                  'Active Settings',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.heading,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          if (labels.isEmpty)
                            const Text(
                              'Default settings active',
                              style: TextStyle(
                                fontSize: 16,
                                color: AppColors.mutedText,
                              ),
                            )
                          else
                            Wrap(
                              spacing: 12,
                              runSpacing: 12,
                              children: labels.map((label) {
                                return Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 12,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: AppColors.border, width: 2),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(6),
                                        decoration: BoxDecoration(
                                          color: AppColors.blueBg,
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: const Icon(
                                          Icons.check,
                                          size: 16,
                                          color: AppColors.primaryAction,
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Text(
                                        label,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.heading,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              }).toList(),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Located in "Profile" > "Display"',
                      style: TextStyle(
                        fontSize: 18,
                        fontStyle: FontStyle.italic,
                        color: AppColors.mutedText,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            _buildFooter(context),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: SizedBox(
        width: double.infinity,
        height: 64,
        child: ElevatedButton.icon(
          onPressed: () {
            context.read<AppState>().markOnboarded();
            context.go('/todays-plan');
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryAction,
            foregroundColor: AppColors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
          ),
          icon: const Icon(Icons.arrow_forward, size: 24),
          label: const Text("Go to Today's Plan"),
        ),
      ),
    );
  }
}
