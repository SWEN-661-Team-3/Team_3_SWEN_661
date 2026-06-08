import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class CareHeader extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final String? subtitle;
  final VoidCallback? onBack;
  final VoidCallback? onAccessibility;

  const CareHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.onBack,
    this.onAccessibility,
  });

  @override
  Size get preferredSize => const Size.fromHeight(72);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          bottom: BorderSide(color: AppColors.border, width: 4),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              if (onBack != null)
                Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: SizedBox(
                    width: 48,
                    height: 48,
                    child: Material(
                      color: AppColors.subtleBg,
                      borderRadius: BorderRadius.circular(16),
                      child: Semantics(
                      label: 'Go back',
                      button: true,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: onBack,
                        child: const Icon(
                          Icons.chevron_left,
                          size: 32,
                          color: AppColors.heading,
                          semanticLabel: 'Go back',
                        ),
                      ),
                      ),
                    ),
                  ),
                ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: AppColors.heading,
                      ),
                    ),
                    if (subtitle != null)
                      Text(
                        subtitle!,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.5,
                          color: AppColors.mutedText,
                        ),
                      ),
                  ],
                ),
              ),
              if (onAccessibility != null)
                SizedBox(
                  width: 48,
                  height: 48,
                  child: Material(
                    color: AppColors.blueBg,
                    borderRadius: BorderRadius.circular(16),
                    child: Semantics(
                      label: 'Accessibility settings',
                      button: true,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: onAccessibility,
                        child: const Icon(
                          Icons.accessibility_new,
                          size: 28,
                          color: AppColors.primaryAction,
                          semanticLabel: 'Accessibility settings',
                        ),
                      ),
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
