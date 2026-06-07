import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.pageBg,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryAction,
        onPrimary: AppColors.white,
        surface: AppColors.white,
        onSurface: AppColors.heading,
        error: AppColors.emergency,
      ),
      fontFamily: null, // system font
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 30,
          fontWeight: FontWeight.w900,
          height: 1.5,
          color: AppColors.heading,
        ),
        headlineMedium: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w900,
          height: 1.5,
          color: AppColors.heading,
        ),
        headlineSmall: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          height: 1.5,
          color: AppColors.heading,
        ),
        bodyLarge: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          height: 1.5,
          color: AppColors.heading,
        ),
        bodyMedium: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          height: 1.5,
          color: AppColors.heading,
        ),
        labelLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          height: 1.5,
          letterSpacing: 1.5,
          color: AppColors.mutedText,
        ),
        bodySmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          height: 1.5,
          color: AppColors.mutedText,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
      ),
    );
  }

  static ThemeData get highContrast {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: Colors.black,
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFFFACC15),
        onPrimary: Colors.black,
        surface: Color(0xFF1E1E1E),
        onSurface: Colors.white,
        error: AppColors.emergency,
      ),
      fontFamily: null,
      textTheme: const TextTheme(
        headlineLarge: TextStyle(fontSize: 30, fontWeight: FontWeight.w900, height: 1.5, color: Colors.white),
        headlineMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, height: 1.5, color: Colors.white),
        headlineSmall: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, height: 1.5, color: Colors.white),
        bodyLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, height: 1.5, color: Colors.white),
        bodyMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w400, height: 1.5, color: Colors.white),
        labelLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, height: 1.5, letterSpacing: 1.5, color: Colors.white70),
        bodySmall: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, height: 1.5, color: Colors.white70),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.black,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
      ),
    );
  }
}
