import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/reminder_preferences.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';

class ReminderPreferencesScreen extends StatefulWidget {
  const ReminderPreferencesScreen({super.key});

  @override
  State<ReminderPreferencesScreen> createState() => _ReminderPreferencesScreenState();
}

class _ReminderPreferencesScreenState extends State<ReminderPreferencesScreen> {
  late bool _sound;
  late bool _vibration;
  late bool _persistent;
  late bool _repeat;
  late bool _caregiverNotify;
  late bool _quietHours;
  late String _timing;

  @override
  void initState() {
    super.initState();
    final p = context.read<AppState>().reminderPrefs;
    _sound = p.sound;
    _vibration = p.vibration;
    _persistent = p.persistent;
    _repeat = p.repeat;
    _caregiverNotify = p.caregiverNotify;
    _quietHours = p.quietHours;
    _timing = p.timing;
  }

  void _save() {
    context.read<AppState>().updateReminderPrefs(
      ReminderPreferences(
        sound: _sound,
        vibration: _vibration,
        persistent: _persistent,
        repeat: _repeat,
        caregiverNotify: _caregiverNotify,
        quietHours: _quietHours,
        timing: _timing,
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Preferences saved'),
        backgroundColor: AppColors.success,
      ),
    );
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Reminder Settings',
            onBack: () => context.pop(),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Customize how reminders work',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: AppColors.heading,
                    ),
                  ),
                  const SizedBox(height: 24),
                  _section('Alert Style', [
                    _toggle('Sound', 'Play an alert sound', Icons.volume_up, _sound, (v) => setState(() => _sound = v)),
                    _toggle('Vibration', 'Vibrate the device', Icons.vibration, _vibration, (v) => setState(() => _vibration = v)),
                    _toggle('Persistent', 'Stay on screen until dismissed', Icons.push_pin, _persistent, (v) => setState(() => _persistent = v)),
                  ]),
                  const SizedBox(height: 24),
                  _section('Behavior', [
                    _toggle('Auto-repeat', 'Remind again if not completed', Icons.repeat, _repeat, (v) => setState(() => _repeat = v)),
                    _toggle('Notify caregiver', 'Alert helper on missed reminders', Icons.person, _caregiverNotify, (v) => setState(() => _caregiverNotify = v)),
                    _toggle('Quiet hours', 'Mute between 10 PM and 7 AM', Icons.bedtime, _quietHours, (v) => setState(() => _quietHours = v)),
                  ]),
                  const SizedBox(height: 24),
                  _section('Timing', [
                    _timingOption('on-time', 'On Time', 'Alert at the exact scheduled time'),
                    _timingOption('5-before', '5 Min Before', 'Get a heads-up a few minutes early'),
                    _timingOption('15-before', '15 Min Before', 'Plenty of time to prepare'),
                  ]),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
          _buildFooter(),
        ],
      ),
    );
  }

  Widget _section(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title.toUpperCase(),
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.5,
            color: AppColors.mutedText,
          ),
        ),
        const SizedBox(height: 12),
        ...children,
      ],
    );
  }

  Widget _toggle(String title, String desc, IconData icon, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border, width: 3),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.primaryAction, size: 24),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.heading,
                    ),
                  ),
                  Text(
                    desc,
                    style: const TextStyle(fontSize: 16, color: AppColors.mutedText),
                  ),
                ],
              ),
            ),
            Switch(
              value: value,
              onChanged: onChanged,
              activeTrackColor: AppColors.primaryAction,
            ),
          ],
        ),
      ),
    );
  }

  Widget _timingOption(String value, String label, String desc) {
    final isSelected = _timing == value;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () => setState(() => _timing = value),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.blueBg : AppColors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? AppColors.primaryAction : AppColors.border,
              width: 3,
            ),
          ),
          child: Row(
            children: [
              Icon(
                Icons.schedule,
                color: isSelected ? AppColors.primaryAction : AppColors.mutedText,
                size: 24,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? AppColors.primaryAction : AppColors.heading,
                      ),
                    ),
                    Text(
                      desc,
                      style: const TextStyle(fontSize: 16, color: AppColors.mutedText),
                    ),
                  ],
                ),
              ),
              if (isSelected)
                const Icon(Icons.check_circle, color: AppColors.primaryAction, size: 24),
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
            onPressed: _save,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryAction,
              foregroundColor: AppColors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            child: const Text('Save Preferences'),
          ),
        ),
      ),
    );
  }
}
