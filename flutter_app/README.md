# CareConnect - Flutter Mobile Application

CareConnect is a mobile health companion app designed for elderly users and their caregivers. It provides medication reminders, appointment tracking, daily health plans, and caregiver coordination with an emphasis on large text, high contrast, and accessible interactions.

## Architecture

- **State Management**: Provider (`ChangeNotifier`) via `AppState`
- **Navigation**: GoRouter with declarative routing and onboarding redirect
- **Persistence**: SharedPreferences for accessibility settings, reminder preferences, and onboarding state
- **Code Organization**:
  - `lib/models/` -- Data classes (Appointment, Reminder, Caregiver, ActivityEntry, AccessibilitySettings, ReminderPreferences)
  - `lib/providers/` -- AppState (ChangeNotifier)
  - `lib/services/` -- PreferencesService (SharedPreferences wrapper)
  - `lib/router/` -- GoRouter configuration
  - `lib/screens/` -- 25 screen implementations
  - `lib/widgets/` -- Reusable components (CareCard, CareHeader, CareBottomNavBar, StatusBadge)
  - `lib/theme/` -- App colors and theme

## Screens

1. Welcome (onboarding)
2. Setup (accessibility preferences)
3. Preview (readability check)
4. Caregiver Setup (add caregiver info)
5. Confirmation (onboarding complete)
6. Home Dashboard
7. Today's Plan
8. Expanded Plan (full daily schedule)
9. Details (task details with actions)
10. Activity Log (history)
11. Emergency (panic button + countdown)
12. Notification (reminder alert)
13. Reminder Detail
14. Snooze Options
15. Reminder Success
16. Missed Reminder
17. Caregiver Help (ask for help)
18. Notification Warning (permissions)
19. Reminder Preferences (settings)
20. Success (generic confirmation)
21. Schedule (my schedule)
22. Emergency Countdown

## How to Run

### Prerequisites

- Flutter SDK 3.x+
- Android Studio or VS Code with Flutter extensions
- An Android emulator or physical device

### Run the App

```bash
cd flutter_app
flutter pub get
flutter run
```

### Build APK

```bash
flutter build apk
```

The APK is output to `build/app/outputs/flutter-apk/app-release.apk`.

## How to Run Tests

### Run All Tests

```bash
flutter test
```

### Run Tests with Coverage

```bash
flutter test --coverage
```

The LCOV report is generated at `coverage/lcov.info`.

### Generate HTML Coverage Report

```bash
genhtml coverage/lcov.info -o coverage/html
```

Then open `coverage/html/index.html` in a browser.

### Run Integration Tests

```bash
flutter test integration_test/app_test.dart
```

### Run E2E Tests (Maestro)

See `../maestro/README.md` for Maestro setup. From repo root:

```bash
maestro test maestro/flutter/
```

### Coverage Summary

- **105+ tests** (unit, widget, and integration)
- **86%+ line coverage** on tested source files
- Test categories:
  - Unit tests: all 6 data models, AppState provider
  - Widget tests: HomeScreen, WelcomeScreen, ConfirmationScreen, SuccessScreen, CareCard, CareHeader, CareBottomNavBar, StatusBadge
  - Integration tests: onboarding, home-to-details, emergency, reminder flows

## Accessibility (Week 6)

WCAG 2.1 AA improvements for elderly/low-vision users:

- **Semantics labels** on all tappable CareCards, emergency controls, and navigation buttons
- **Live regions** for emergency countdown timer announcements
- **Global settings wiring**: text scaling, high-contrast theme, dark mode, wide spacing, reduced motion, screen reader landmark
- **Color contrast fixes**: darker text on tinted backgrounds, improved high-contrast theme secondary text

### Screen Reader Testing

1. Enable TalkBack (Android) or VoiceOver (iOS)
2. Navigate Home > Emergency, Home > Details, and reminder flows
3. Verify buttons announce descriptive labels (e.g., "Emergency help", "Mark Complete")

## Known Issues and Limitations

- Data is hardcoded sample data (no backend API integration)
- SharedPreferences persistence for settings only; task/reminder state is in-memory
- EmergencyCountdownScreen is a stub placeholder
- iOS build not tested (Windows development environment)

## Team Member Contributions (Week 4)

- Ryan Morris: Full implementation of 25 screens, GoRouter navigation, Provider state management, SharedPreferences persistence, responsive layouts, accessibility (Semantics), unit and widget tests, APK build

## AI Usage Summary

- AI (Cursor with Claude) assisted with:
  - Translating Figma-exported TSX designs into Flutter widget code
  - Generating boilerplate for data models and copyWith methods
  - Writing unit tests for models and widget tests for screens
  - Debugging PowerShell/CLI syntax issues for GitHub operations
  - Code review and identifying accessibility improvements
- All AI-generated code was reviewed, tested, and adjusted for correctness
