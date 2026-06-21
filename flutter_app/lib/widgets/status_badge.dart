import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

enum BadgeType { done, missed, sent, todo }

class StatusBadge extends StatelessWidget {
  final BadgeType type;

  const StatusBadge({
    super.key,
    required this.type,
  });

  @override
  Widget build(BuildContext context) {
    final (label, icon, fg, bg) = switch (type) {
      BadgeType.done => ('Done', Icons.check_circle_outline, AppColors.success, AppColors.successBg),
      BadgeType.missed => ('Missed', Icons.error_outline, AppColors.warningDark, AppColors.warningBg),
      BadgeType.sent => ('Sent', Icons.send, AppColors.primaryAction, AppColors.blueBg),
      BadgeType.todo => ('To Do', Icons.circle_outlined, AppColors.heading, AppColors.blueBg),
    };

    return Container(
      constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ExcludeSemantics(child: Icon(icon, size: 18, color: fg)),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: fg,
            ),
          ),
        ],
      ),
    );
  }
}
