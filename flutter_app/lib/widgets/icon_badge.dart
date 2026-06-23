import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// High-contrast icon container: dark semantic background with a white icon.
class IconBadge extends StatelessWidget {
  final IconData icon;
  final Color color;
  final double padding;
  final double iconSize;
  final double borderRadius;

  const IconBadge({
    super.key,
    required this.icon,
    required this.color,
    this.padding = 12,
    this.iconSize = 28,
    this.borderRadius = 16,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(padding),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
      child: Icon(icon, size: iconSize, color: AppColors.white),
    );
  }
}
