import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';

class PreviewScreen extends StatefulWidget {
  const PreviewScreen({super.key});

  @override
  State<PreviewScreen> createState() => _PreviewScreenState();
}

class _PreviewScreenState extends State<PreviewScreen> {
  late String _previewSize;
  late bool _highContrast;

  @override
  void initState() {
    super.initState();
    final s = context.read<AppState>().settings;
    _previewSize = s.textSize;
    _highContrast = s.contrast == 'high';
  }

  double get _scaleFactor {
    switch (_previewSize) {
      case 'extra-large':
        return 1.3;
      case 'large':
        return 1.15;
      default:
        return 1.0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bg = _highContrast ? Colors.black : AppColors.pageBg;
    final textColor = _highContrast ? Colors.white : AppColors.heading;
    final mutedColor = _highContrast ? Colors.white70 : AppColors.mutedText;
    final accent = _highContrast ? const Color(0xFFFACC15) : AppColors.primaryAction;

    return Scaffold(
      backgroundColor: bg,
      body: Column(
        children: [
          CareHeader(
            title: 'Readability Check',
            onBack: () => context.pop(),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'How does this look?',
                    style: TextStyle(
                      fontSize: 28 * _scaleFactor,
                      fontWeight: FontWeight.w900,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Try the buttons below to find the size and color that works best for you.',
                    style: TextStyle(
                      fontSize: 16 * _scaleFactor,
                      fontWeight: FontWeight.w500,
                      color: mutedColor,
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildControls(accent, textColor, mutedColor),
                  const SizedBox(height: 24),
                  _buildSampleView(accent, textColor, mutedColor, bg),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
          _buildFooter(accent, textColor),
        ],
      ),
    );
  }

  Widget _buildControls(Color accent, Color textColor, Color mutedColor) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _highContrast ? const Color(0xFF1E1E1E) : AppColors.blueBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: _highContrast ? Colors.white24 : AppColors.border,
          width: 4,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Text Size',
            style: TextStyle(
              fontSize: 18, fontWeight: FontWeight.w700, color: textColor,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _sizeButton('medium', 'MEDIUM', accent, textColor),
              const SizedBox(width: 8),
              _sizeButton('large', 'LARGE', accent, textColor),
              const SizedBox(width: 8),
              _sizeButton('extra-large', 'EXTRA', accent, textColor),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 52,
            child: OutlinedButton(
              onPressed: () => setState(() => _highContrast = !_highContrast),
              style: OutlinedButton.styleFrom(
                foregroundColor: textColor,
                side: BorderSide(color: accent, width: 3),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Text(
                _highContrast ? 'Switch to Normal' : 'Switch to High Contrast',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sizeButton(String value, String label, Color accent, Color textColor) {
    final isSelected = _previewSize == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _previewSize = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? accent : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isSelected ? accent : (textColor.withValues(alpha: 0.3)),
              width: 2,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
                color: isSelected
                    ? (_highContrast ? Colors.black : AppColors.white)
                    : textColor,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSampleView(Color accent, Color textColor, Color mutedColor, Color bg) {
    final cardBg = _highContrast ? const Color(0xFF2A2A2A) : AppColors.white;
    final cardBorder = _highContrast ? Colors.white24 : AppColors.border;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sample View',
          style: TextStyle(
            fontSize: 18 * _scaleFactor,
            fontWeight: FontWeight.w700,
            color: mutedColor,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'Today, May 24',
          style: TextStyle(
            fontSize: 20 * _scaleFactor,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 12),
        CareCard(
          backgroundColor: cardBg,
          borderColor: cardBorder,
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(Icons.calendar_today, color: accent, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Eye Doctor Appt',
                      style: TextStyle(
                        fontSize: 18 * _scaleFactor,
                        fontWeight: FontWeight.w700,
                        color: textColor,
                      ),
                    ),
                    Text(
                      '10:30 AM \u2022 2 miles away',
                      style: TextStyle(
                        fontSize: 16 * _scaleFactor,
                        color: mutedColor,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Confirmed',
                  style: TextStyle(
                    fontSize: 16 * _scaleFactor,
                    fontWeight: FontWeight.w700,
                    color: accent,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        CareCard(
          backgroundColor: cardBg,
          borderColor: cardBorder,
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.warningBg,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(Icons.notifications, color: AppColors.warningDark, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Medicine Reminder',
                      style: TextStyle(
                        fontSize: 18 * _scaleFactor,
                        fontWeight: FontWeight.w700,
                        color: textColor,
                      ),
                    ),
                    Text(
                      'Take 1 Vitamin at Noon',
                      style: TextStyle(
                        fontSize: 16 * _scaleFactor,
                        color: mutedColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFooter(Color accent, Color textColor) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: _highContrast ? Colors.black : AppColors.white,
        border: Border(
          top: BorderSide(
            color: _highContrast ? Colors.white24 : AppColors.border,
            width: 4,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 60,
                child: OutlinedButton(
                  onPressed: () => context.go('/setup'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: textColor,
                    side: BorderSide(color: accent, width: 3),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Makes Changes',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, height: 1.0),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: SizedBox(
                height: 60,
                child: ElevatedButton(
                  onPressed: () {
                    final appState = context.read<AppState>();
                    appState.updateSettings(
                      appState.settings.copyWith(
                        textSize: _previewSize,
                        contrast: _highContrast ? 'high' : 'standard',
                      ),
                    );
                    context.go('/caregiver-setup');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: accent,
                    foregroundColor: _highContrast ? Colors.black : AppColors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Looks Good',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, height: 1.0),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
