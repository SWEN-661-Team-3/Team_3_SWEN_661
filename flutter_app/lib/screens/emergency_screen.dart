import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';

class EmergencyScreen extends StatefulWidget {
  const EmergencyScreen({super.key});

  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  bool _counting = false;
  int _countdown = 10;
  Timer? _timer;

  void _startCountdown() {
    setState(() {
      _counting = true;
      _countdown = 10;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countdown <= 1) {
        timer.cancel();
        _onAlertSent();
      } else {
        setState(() => _countdown--);
      }
    });
  }

  void _cancelCountdown() {
    _timer?.cancel();
    setState(() {
      _counting = false;
      _countdown = 10;
    });
  }

  void _onAlertSent() {
    _timer?.cancel();
    context.go('/emergency-confirmed');
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Emergency Help',
            onBack: () => context.pop(),
          ),
          Expanded(
            child: _counting ? _buildCountdown() : _buildIdle(),
          ),
        ],
      ),
    );
  }

  Widget _buildIdle() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 40),
          GestureDetector(
            onTap: _startCountdown,
            child: Semantics(
              button: true,
              label: 'I need help. Tap to alert your care circle.',
              child: Container(
                width: 200,
                height: 200,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.emergency,
                  boxShadow: [
                    BoxShadow(
                      color: Color(0x44DC2626),
                      blurRadius: 40,
                      spreadRadius: 4,
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Text(
                  'I Need\nHelp',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: AppColors.white,
                    height: 1.2,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Tap to alert your care circle.',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.mutedText,
            ),
          ),
          const SizedBox(height: 48),
          CareCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'EMERGENCY CONTACTS',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.5,
                    color: AppColors.heading,
                  ),
                ),
                const SizedBox(height: 20),
                _contactRow('Sarah (Daughter)'),
                const Divider(height: 24, color: AppColors.border),
                _contactRow("Dr. Miller's Office"),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCountdown() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.emergency,
              border: Border.all(color: AppColors.emergencyDark, width: 4),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x44DC2626),
                  blurRadius: 40,
                  spreadRadius: 4,
                ),
              ],
            ),
            alignment: Alignment.center,
            child: Text(
              '$_countdown',
              style: const TextStyle(
                fontSize: 72,
                fontWeight: FontWeight.w900,
                color: AppColors.white,
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Sending alert in $_countdown seconds...',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.mutedText,
            ),
          ),
          const SizedBox(height: 40),
          SizedBox(
            width: double.infinity,
            height: 72,
            child: OutlinedButton.icon(
              onPressed: _cancelCountdown,
              icon: const Icon(Icons.close, size: 28),
              label: const Text(
                'Cancel',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.emergency,
                side: const BorderSide(color: AppColors.emergency, width: 4),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(36),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Alert will be sent automatically when the timer reaches zero.',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.mutedText,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _contactRow(String name) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.blueLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.person_outline, size: 24, color: AppColors.primaryAction),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              name,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: AppColors.heading,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.successBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.phone, size: 24, color: AppColors.success),
          ),
        ],
      ),
    );
  }
}

class EmergencyConfirmedScreen extends StatelessWidget {
  const EmergencyConfirmedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final time = TimeOfDay.now();
    final formatted = '${time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod}:'
        '${time.minute.toString().padLeft(2, '0')} '
        '${time.period == DayPeriod.am ? 'AM' : 'PM'}';

    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: AppColors.successBg,
                  borderRadius: BorderRadius.circular(48),
                  border: Border.all(color: AppColors.successLight, width: 4),
                ),
                child: const Icon(
                  Icons.check_circle_outline,
                  size: 80,
                  color: AppColors.success,
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'Help Is On The Way',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.w900,
                  color: AppColors.heading,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              const Text(
                'Sarah (Daughter) has been notified.',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.mutedText,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              CareCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'ALERT SENT',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.5,
                        color: AppColors.mutedText,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      formatted,
                      style: const TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                        color: AppColors.heading,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                height: 72,
                child: ElevatedButton.icon(
                  onPressed: () => context.go('/home'),
                  icon: const Icon(Icons.home, size: 28),
                  label: const Text(
                    'Return Home',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.heading,
                    foregroundColor: AppColors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(36),
                    ),
                    elevation: 8,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
