# CareConnect - React Native (Expo)

A cross-platform health companion app built with React Native and Expo, ported from the Flutter implementation. CareConnect helps elderly users manage medications, appointments, and daily health tasks with an accessible, high-contrast interface.

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- Android emulator or iOS simulator (or Expo Go on a physical device)

### Installation

```bash
cd react-native-app
npm install --legacy-peer-deps
```

### Running

```bash
npx expo start          # Start Expo dev server
npx expo start --android # Launch on Android emulator
npx expo start --ios     # Launch on iOS simulator
```

### Testing

```bash
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage report
```

## Architecture

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | React Navigation (Native Stack) |
| State | React Context + useReducer |
| Persistence | AsyncStorage |
| Icons | @expo/vector-icons (Ionicons) |
| Testing | Jest + React Native Testing Library |

### Project Structure

```
src/
  models/          Data models (Appointment, Reminder, Caregiver, etc.)
  context/         AppContext with useReducer for global state
  services/        PreferencesService (AsyncStorage persistence)
  theme/           Colors and typography constants
  navigation/      AppNavigator (stack navigator with 22 routes)
  components/      Shared UI: CareCard, CareHeader, CareBottomNavBar, StatusBadge
  screens/         22 screens covering onboarding, core, reminder, and emergency flows
```

### Screens (22 total)

**Onboarding (5):** Welcome, Setup, Preview, CaregiverSetup, Confirmation

**Core (6):** Home, TodaysPlan, ExpandedPlan, Schedule, Details, Success

**Reminder Flow (5):** Notification, ReminderDetail, SnoozeOptions, ReminderSuccess, MissedReminder

**Emergency (3):** Emergency, EmergencyConfirmed, CaregiverHelp

**Settings/Auxiliary (3):** NotificationWarning, ReminderPreferences, ActivityLog

## React Native vs Flutter Comparison

| Aspect | Flutter | React Native (Expo) |
|--------|---------|-------------------|
| Language | Dart | JavaScript |
| State Management | Provider + ChangeNotifier | Context + useReducer |
| Navigation | GoRouter (declarative) | React Navigation (imperative) |
| Persistence | SharedPreferences | AsyncStorage |
| Styling | Widget properties + ThemeData | StyleSheet.create |
| Icons | Material Icons | @expo/vector-icons (Ionicons) |
| Testing | flutter_test + widget tests | Jest + RNTL |
| Build | flutter build apk/ipa | expo build / EAS Build |
| Hot Reload | Built-in | Built-in (Fast Refresh) |
| Layout | Widget tree (Column, Row, Expanded) | Flexbox (View, flex: 1) |
| Accessibility | Semantics widget | accessibilityRole, accessibilityLabel |

### Key Differences Encountered

1. **Styling**: Flutter's widget-based styling (padding, margin as widget props) vs RN's StyleSheet objects. RN's flexbox model is more familiar to web developers.
2. **Navigation**: GoRouter uses URL-like paths (`/details/:id`); React Navigation uses screen names with params (`navigate('Details', { id })`).
3. **State**: Provider/ChangeNotifier pattern maps cleanly to Context/useReducer. The reducer pattern provides more predictable state transitions.
4. **Layout overflow**: Flutter requires explicit Expanded/Flexible widgets; RN's flexbox handles overflow more naturally with `flex: 1`.
5. **Persistence**: Both use key-value stores (SharedPreferences vs AsyncStorage) with similar JSON serialization patterns.

## Test Coverage

- 33 test suites, 133 tests
- 72%+ statement coverage
- Coverage areas: models (100%), components (100%), context/reducer, screens, services
