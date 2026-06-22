# Maestro E2E Tests

End-to-end test flows for CareConnect Flutter and React Native apps using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

- [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro) installed
- Flutter app built and installed on emulator/device, or Expo app running for React Native

## Flutter

```bash
cd flutter_app
flutter build apk   # or: flutter run -d <device>
maestro test ../maestro/flutter/
```

**Important:** A fresh install starts on `/welcome` (onboarding). The emergency button is **not** on Welcome/Setup/Preview — only after onboarding on Home, Today's Plan, and other main screens.

Flows:
- `onboarding-flow.yaml` - Welcome through Preview (partial)
- `complete-onboarding.yaml` - Full onboarding through Today's Plan (`clearState: true`)
- `emergency-flow.yaml` - Runs `complete-onboarding.yaml`, then taps emergency button

Maestro target for the red asterisk button:
- **Accessibility label:** `Emergency help` (from Flutter `Semantics(label: ...)`)
- **Test id:** `emergency-help` (from `Semantics(identifier: ...)` and `Key('emergency-help')`)

Maestro Studio may show `Emergency help` twice if both a parent `Semantics` label and child `semanticLabel` exist — we use only the wrapper label now.

To run only the emergency E2E:

```bash
maestro test ../maestro/flutter/emergency-flow.yaml
```

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
