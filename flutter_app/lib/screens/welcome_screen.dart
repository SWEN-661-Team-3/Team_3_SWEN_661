import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth > 600;
            return Column(
              children: [
                _buildHeader(),
                Expanded(
                  child: isWide
                      ? _buildTabletBody(context)
                      : _buildMobileBody(context),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.primaryAction,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(Icons.favorite, color: AppColors.white, size: 28),
          ),
          const SizedBox(width: 16),
          const Text(
            'CareConnect',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.w900,
              color: AppColors.heading,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabletBody(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Welcome to your\nhealthcare support.',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    color: AppColors.heading,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'We are here to help you manage your health simply and clearly.',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                    color: AppColors.mutedText,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 40),
                ..._buildButtons(context),
              ],
            ),
          ),
        ),
        Expanded(child: _buildHeroImage()),
      ],
    );
  }

  Widget _buildMobileBody(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 16),
          _buildHeroImage(),
          const SizedBox(height: 32),
          const Text(
            'Welcome to your\nhealthcare support.',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              color: AppColors.heading,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'We are here to help you manage your health simply and clearly.',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w500,
              color: AppColors.mutedText,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 32),
          ..._buildButtons(context),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildHeroImage() {
    return Container(
      constraints: const BoxConstraints(maxHeight: 400),
      decoration: BoxDecoration(
        color: AppColors.blueBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.border, width: 4),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: const Center(
          child: Padding(
            padding: EdgeInsets.all(40),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.favorite, size: 80, color: AppColors.primaryAction),
                SizedBox(height: 16),
                Text(
                  'CareConnect',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: AppColors.primaryAction,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Your health, simplified.',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.mutedText,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _buildButtons(BuildContext context) {
    return [
      SizedBox(
        width: double.infinity,
        height: 64,
        child: ElevatedButton.icon(
          onPressed: () => context.go('/setup'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryAction,
            foregroundColor: AppColors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
          ),
          icon: const Icon(Icons.arrow_forward, size: 24),
          label: const Text('Start Setup'),
        ),
      ),
      const SizedBox(height: 16),
      SizedBox(
        width: double.infinity,
        height: 64,
        child: OutlinedButton.icon(
          onPressed: () => context.go('/setup'),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.heading,
            side: const BorderSide(color: AppColors.border, width: 3),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
          ),
          icon: const Icon(Icons.settings, size: 24),
          label: const Text('Use Recommended Settings'),
        ),
      ),
    ];
  }
}
