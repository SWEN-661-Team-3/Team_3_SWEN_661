import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';

class SnoozeOptionsScreen extends StatefulWidget {
  const SnoozeOptionsScreen({super.key});

  @override
  State<SnoozeOptionsScreen> createState() => _SnoozeOptionsScreenState();
}

class _SnoozeOptionsScreenState extends State<SnoozeOptionsScreen> {
  String _selected = '15';

  static const _options = [
    {'value': '5', 'label': '5 Minutes', 'desc': 'Quick pause'},
    {'value': '15', 'label': '15 Minutes', 'desc': 'Short break'},
    {'value': '30', 'label': '30 Minutes', 'desc': 'Take your time'},
    {'value': '60', 'label': '1 Hour', 'desc': 'Longer delay'},
    {'value': '120', 'label': '2 Hours', 'desc': 'Extended snooze'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Snooze Reminder',
            onBack: () => context.pop(),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'How long would you like to wait?',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: AppColors.heading,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Choose when you would like to be reminded again.',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: AppColors.mutedText,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ..._options.map((opt) => _buildOption(opt)),
                ],
              ),
            ),
          ),
          _buildFooter(),
        ],
      ),
    );
  }

  Widget _buildOption(Map<String, String> opt) {
    final isSelected = _selected == opt['value'];
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () => setState(() => _selected = opt['value']!),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.blueBg : AppColors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isSelected ? AppColors.primaryAction : AppColors.border,
              width: 4,
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primaryAction : AppColors.subtleBg,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  Icons.snooze,
                  size: 24,
                  color: isSelected ? AppColors.white : AppColors.mutedText,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      opt['label']!,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? AppColors.primaryAction : AppColors.heading,
                      ),
                    ),
                    Text(
                      opt['desc']!,
                      style: const TextStyle(fontSize: 16, color: AppColors.mutedText),
                    ),
                  ],
                ),
              ),
              if (isSelected)
                const Icon(Icons.check_circle, color: AppColors.primaryAction, size: 28),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 4)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          width: double.infinity,
          height: 64,
          child: ElevatedButton(
            onPressed: () {
              final appState = context.read<AppState>();
              if (appState.reminders.isNotEmpty) {
                appState.snoozeReminder(appState.reminders.first.id);
              }
              context.go('/success?type=snooze&title=Medication');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryAction,
              foregroundColor: AppColors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            child: const Text('Snooze Reminder'),
          ),
        ),
      ),
    );
  }
}
