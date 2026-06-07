import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';

class _StubScreen extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool showBack;

  const _StubScreen({
    required this.title,
    // ignore: unused_element_parameter
    this.subtitle = 'Coming soon',
    this.showBack = true,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: title,
            onBack: showBack ? () => context.pop() : null,
          ),
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.construction, size: 64, color: AppColors.mutedText),
                    const SizedBox(height: 16),
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 24, fontWeight: FontWeight.w900,
                        color: AppColors.heading,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w700,
                        color: AppColors.mutedText,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class EmergencyCountdownScreen extends StatelessWidget {
  const EmergencyCountdownScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      const _StubScreen(title: 'Emergency Countdown', showBack: false);
}
