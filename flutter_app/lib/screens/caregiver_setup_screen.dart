import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/caregiver.dart';
import '../theme/app_colors.dart';
import '../widgets/care_header.dart';
import '../widgets/care_card.dart';

class CaregiverSetupScreen extends StatefulWidget {
  const CaregiverSetupScreen({super.key});

  @override
  State<CaregiverSetupScreen> createState() => _CaregiverSetupScreenState();
}

class _CaregiverSetupScreenState extends State<CaregiverSetupScreen> {
  final _nameController = TextEditingController();
  final _relationController = TextEditingController();
  final _phoneController = TextEditingController();
  final _permissions = <String>{'appointments', 'reminders', 'help'};
  bool _nameValid = false;

  @override
  void initState() {
    super.initState();
    _nameController.addListener(_onNameChanged);
  }

  void _onNameChanged() {
    final valid = _nameController.text.trim().isNotEmpty;
    if (valid != _nameValid) {
      setState(() => _nameValid = valid);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _relationController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _addAndContinue() {
    if (_nameController.text.trim().isNotEmpty) {
      context.read<AppState>().addCaregiver(
        Caregiver(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          name: _nameController.text.trim(),
          relationship: _relationController.text.trim(),
          phone: _phoneController.text.trim(),
          permissions: _permissions.toList(),
        ),
      );
    }
    context.go('/confirmation');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      body: Column(
        children: [
          CareHeader(
            title: 'Add Help',
            onBack: () => context.canPop() ? context.pop() : context.go('/welcome'),
          ),
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
                        'Add a trusted helper',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: AppColors.heading,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'You can add a family member or friend to help manage your care.',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                          color: AppColors.mutedText,
                        ),
                      ),
                      const SizedBox(height: 24),
                      isWide
                          ? Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(child: _buildForm()),
                                const SizedBox(width: 24),
                                Expanded(child: _buildPermissions()),
                              ],
                            )
                          : Column(
                              children: [
                                _buildForm(),
                                const SizedBox(height: 24),
                                _buildPermissions(),
                              ],
                            ),
                      const SizedBox(height: 16),
                      Text(
                        'You can change permissions at any time in Settings.',
                        style: TextStyle(
                          fontSize: 18,
                          fontStyle: FontStyle.italic,
                          color: AppColors.mutedText,
                        ),
                      ),
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

  Widget _buildForm() {
    return Column(
      children: [
        _inputField(
          controller: _nameController,
          label: "Helper's Full Name",
          hint: 'e.g. Sarah Jones',
          icon: Icons.person,
        ),
        const SizedBox(height: 16),
        _inputField(
          controller: _relationController,
          label: 'Relationship to You',
          hint: 'e.g. Daughter',
          icon: Icons.people,
        ),
        const SizedBox(height: 16),
        _inputField(
          controller: _phoneController,
          label: 'Phone Number',
          hint: '555-0123',
          icon: Icons.phone,
          keyboardType: TextInputType.phone,
        ),
      ],
    );
  }

  Widget _inputField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.heading,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppColors.border, width: 3),
          ),
          child: TextField(
            controller: controller,
            keyboardType: keyboardType,
            style: const TextStyle(fontSize: 20, color: AppColors.heading),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(color: AppColors.disabledText),
              prefixIcon: Padding(
                padding: const EdgeInsets.only(left: 16, right: 12),
                child: Icon(icon, color: AppColors.primaryAction, size: 24),
              ),
              prefixIconConstraints: const BoxConstraints(minWidth: 0),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 20, vertical: 18,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPermissions() {
    return CareCard(
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
                child: const Icon(Icons.shield, color: AppColors.primaryAction, size: 24),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'What they can see',
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
          _permissionTile(
            'appointments',
            'Appointments',
            'They can see when you have doctor visits.',
            Icons.calendar_today,
          ),
          const SizedBox(height: 12),
          _permissionTile(
            'reminders',
            'Reminders',
            'They can help you stay on track with medicine.',
            Icons.notifications,
          ),
          const SizedBox(height: 12),
          _permissionTile(
            'help',
            'Help Requests',
            'They will be notified if you ask for help.',
            Icons.help,
          ),
        ],
      ),
    );
  }

  Widget _permissionTile(String key, String title, String desc, IconData icon) {
    final isOn = _permissions.contains(key);
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isOn) {
            _permissions.remove(key);
          } else {
            _permissions.add(key);
          }
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isOn ? AppColors.blueBg : AppColors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isOn ? AppColors.primaryAction : AppColors.border,
            width: 3,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: isOn ? AppColors.primaryAction : AppColors.mutedText, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: isOn ? AppColors.primaryAction : AppColors.heading,
                    ),
                  ),
                  Text(
                    desc,
                    style: const TextStyle(fontSize: 16, color: AppColors.mutedText),
                  ),
                ],
              ),
            ),
            if (isOn)
              const Icon(Icons.check_circle, color: AppColors.primaryAction, size: 24),
          ],
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
        child: Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 60,
                child: OutlinedButton(
                  onPressed: () => context.go('/confirmation'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.heading,
                    side: const BorderSide(color: AppColors.border, width: 3),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Skip for Now',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, height: 1.0),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: SizedBox(
                height: 60,
                child: ElevatedButton(
                  onPressed: _nameValid ? _addAndContinue : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryAction,
                    foregroundColor: AppColors.white,
                    disabledBackgroundColor: AppColors.border,
                    disabledForegroundColor: AppColors.disabledText,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Add Caregiver',
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
