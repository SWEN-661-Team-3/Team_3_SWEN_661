import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/accessibility_settings.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';

class SetupScreen extends StatefulWidget {
  const SetupScreen({super.key});

  @override
  State<SetupScreen> createState() => _SetupScreenState();
}

class _SetupScreenState extends State<SetupScreen> {
  late String _textSize;
  late String _contrast;
  late String _theme;
  late String _spacing;
  late String _motion;
  late String _screenReader;

  @override
  void initState() {
    super.initState();
    final s = context.read<AppState>().settings;
    _textSize = s.textSize;
    _contrast = s.contrast;
    _theme = s.theme;
    _spacing = s.spacing;
    _motion = s.motion;
    _screenReader = s.screenReader;
  }

  void _saveAndContinue() {
    final updated = AccessibilitySettings(
      textSize: _textSize,
      contrast: _contrast,
      theme: _theme,
      spacing: _spacing,
      motion: _motion,
      screenReader: _screenReader,
    );
    context.read<AppState>().updateSettings(updated);
    context.go('/preview');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(title: 'Set Up View', onBack: () => context.pop()),
          Expanded(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final isWide = constraints.maxWidth > 600;
                return SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Personalize your view',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: AppColors.heading,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Choose what makes this app easiest for you to use.',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                          color: AppColors.mutedText,
                        ),
                      ),
                      const SizedBox(height: 24),
                      isWide
                          ? _buildTwoColumn()
                          : _buildSingleColumn(),
                      const SizedBox(height: 24),
                    ],
                  ),
                );
              },
            ),
          ),
          _buildFooter(),
        ],
      ),
    );
  }

  Widget _buildTwoColumn() {
    final sections = _buildSections();
    final half = (sections.length / 2).ceil();
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(children: sections.sublist(0, half)),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: Column(children: sections.sublist(half)),
        ),
      ],
    );
  }

  Widget _buildSingleColumn() {
    return Column(children: _buildSections());
  }

  List<Widget> _buildSections() {
    return [
      _settingSection(
        icon: Icons.text_fields,
        title: 'Text Size',
        options: ['medium', 'large', 'extra-large'],
        labels: ['Medium', 'Large', 'Extra Large'],
        selected: _textSize,
        onSelect: (v) => setState(() => _textSize = v),
      ),
      _settingSection(
        icon: Icons.contrast,
        title: 'Contrast Mode',
        options: ['standard', 'high'],
        labels: ['Standard', 'High Contrast'],
        selected: _contrast,
        onSelect: (v) => setState(() => _contrast = v),
      ),
      _settingSection(
        icon: Icons.brightness_6,
        title: 'Theme',
        options: ['light', 'dark'],
        labels: ['Light', 'Dark Mode'],
        selected: _theme,
        onSelect: (v) => setState(() => _theme = v),
      ),
      _settingSection(
        icon: Icons.space_bar,
        title: 'Spacing',
        options: ['standard', 'wide'],
        labels: ['Standard', 'Wide'],
        selected: _spacing,
        onSelect: (v) => setState(() => _spacing = v),
      ),
      _settingSection(
        icon: Icons.animation,
        title: 'Motion',
        options: ['standard', 'reduced'],
        labels: ['Standard', 'Reduced Motion'],
        selected: _motion,
        onSelect: (v) => setState(() => _motion = v),
      ),
      _settingSection(
        icon: Icons.hearing,
        title: 'Screen Reader',
        options: ['off', 'on'],
        labels: ['Off', 'On'],
        selected: _screenReader,
        onSelect: (v) => setState(() => _screenReader = v),
      ),
    ];
  }

  Widget _settingSection({
    required IconData icon,
    required String title,
    required List<String> options,
    required List<String> labels,
    required String selected,
    required ValueChanged<String> onSelect,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
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
                child: Icon(icon, size: 24, color: AppColors.primaryAction),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.heading,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: List.generate(options.length, (i) {
              final isSelected = selected == options[i];
              return GestureDetector(
                onTap: () => onSelect(options[i]),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.blueBg : AppColors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected ? AppColors.primaryAction : AppColors.border,
                      width: 4,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        labels[i],
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: isSelected ? AppColors.primaryAction : AppColors.heading,
                        ),
                      ),
                      if (isSelected) ...[
                        const SizedBox(width: 8),
                        const Icon(Icons.check_circle, color: AppColors.primaryAction, size: 22),
                      ],
                    ],
                  ),
                ),
              );
            }),
          ),
        ],
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
            onPressed: _saveAndContinue,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryAction,
              foregroundColor: AppColors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            child: const Text('Preview Settings'),
          ),
        ),
      ),
    );
  }
}
