# Maestro E2E Tests

End-to-end test flows for CareConnect Flutter and React Native apps using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

- [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro) installed
- Flutter app built and installed on emulator/device, or Expo app running for React Native

## Flutter

```bash
cd flutter_app
flutter build apk   # or run on emulator
maestro test ../maestro/flutter/
```

Flows:
- `onboarding-flow.yaml` - Welcome to Setup to Preview
- `complete-onboarding.yaml` - Full onboarding to Today's Plan
- `emergency-flow.yaml` - Emergency help screen

## React Native (Expo)

```bash
cd react-native-app
npx expo start
# In another terminal:
maestro test ../maestro/react-native/
```

Flows:
- `onboarding-flow.yaml` - Welcome to Setup to Preview
- `emergency-flow.yaml` - Emergency help screen
- `reminder-flow.yaml` - Reminder notification to completion

## Screen Reader Testing

After running Maestro flows, verify accessibility with:
- **Android**: Settings > Accessibility > TalkBack
- **iOS**: Settings > Accessibility > VoiceOver

Confirm that buttons announce their accessibility labels (e.g., "Emergency help", "Mark Done").
