import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';

class CaregiverHelpScreen extends StatefulWidget {
  const CaregiverHelpScreen({super.key});

  @override
  State<CaregiverHelpScreen> createState() => _CaregiverHelpScreenState();
}

class _CaregiverHelpScreenState extends State<CaregiverHelpScreen> {
  final Set<String> _notifiedCaregiverIds = {};

  @override
  Widget build(BuildContext context) {
    final caregivers = context.watch<AppState>().caregivers;

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(title: 'Ask for Help', onBack: () => context.pop()),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Contact your helper',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: AppColors.heading,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Choose someone to notify for help with your care.',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: AppColors.mutedText,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ...caregivers.map((c) {
                    final isNotified = _notifiedCaregiverIds.contains(c.id);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: CareCard(
                        backgroundColor: isNotified
                            ? AppColors.successBg
                            : AppColors.white,
                        borderColor: isNotified
                            ? AppColors.success
                            : AppColors.border,
                        onTap: () {
                          setState(() => _notifiedCaregiverIds.add(c.id));
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                'Notifying ${c.name}',
                                style: const TextStyle(color: AppColors.white),
                              ),
                              backgroundColor: AppColors.primaryAction,
                            ),
                          );
                        },
                        child: Row(
                          children: [
                            Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: AppColors.caregiver,
                                borderRadius: BorderRadius.circular(18),
                              ),
                              child: const Icon(
                                Icons.person,
                                color: AppColors.purpleBg,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    c.name,
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                      color: isNotified
                                          ? AppColors.success
                                          : AppColors.heading,
                                    ),
                                  ),
                                  Text(
                                    c.relationship,
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: isNotified
                                          ? AppColors.success
                                          : AppColors.mutedText,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (!isNotified)
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppColors.primaryAction,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: const Icon(
                                  Icons.send,
                                  color: AppColors.white,
                                  size: 20,
                                ),
                              ),
                            if (isNotified) ...[
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 10,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.success,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: const Text(
                                  'Notified',
                                  style: TextStyle(
                                    color: AppColors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
