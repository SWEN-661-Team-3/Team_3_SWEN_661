import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class CareCard extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final Color borderColor;
  final Color backgroundColor;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  const CareCard({
    super.key,
    required this.child,
    this.borderRadius = 36,
    this.borderColor = AppColors.border,
    this.backgroundColor = AppColors.white,
    this.padding = const EdgeInsets.all(24),
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor, width: 4),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      padding: padding,
      child: child,
    );

    if (onTap != null) {
      return Semantics(
        button: true,
        child: GestureDetector(
          onTap: onTap,
          child: card,
        ),
      );
    }
    return card;
  }
}
