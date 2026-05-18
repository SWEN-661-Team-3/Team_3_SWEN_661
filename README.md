# Team 3 - Low Vision Accessibility App

SWEN 661 User Interface Implementation

An application providing mobile, desktop, and web customization for care recipients with low vision accessibility needs.

## Team Members

| Name | GitHub | Role (Weeks 1-2) |
|------|--------|-------------------|
| Alyssa Smith | [@asmit1325-ai](https://github.com/asmit1325-ai) | Tech Lead |
| Crystal Schelmety | [@cschel](https://github.com/cschel) | Doc Lead |
| Ryan Morris | [@ryanramorris16](https://github.com/ryanramorris16) | QA Lead |

## Project Documents

- [Team Charter](https://github.com/cschel/Team_3_SWEN_661/wiki/Team-Charter)

## Repository Structure

```
├── flutter_app/          Flutter Hello World (mobile)
├── react-native-app/     React Native / Expo Hello World (mobile)
├── electron-app/         Electron Hello World (desktop)
├── react-vite-app/       React + Vite Hello World (web)
└── screenshots/          Proof-of-setup screenshots
```

## Setup Instructions

### Prerequisites

- [Node.js LTS](https://nodejs.org/) (v22+)
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (3.41+)
- [Android Studio](https://developer.android.com/studio) with emulator configured
- [Git](https://git-scm.com/downloads)

### Clone and Run

```bash
git clone https://github.com/cschel/Team_3_SWEN_661.git
cd Team_3_SWEN_661
```

**React + Vite (Web):**
```bash
cd react-vite-app
npm install
npm run dev
# Opens at http://localhost:5173
```

**Electron (Desktop):**
```bash
cd electron-app
npm install
npm start
```

**React Native / Expo (Mobile):**
```bash
cd react-native-app
npm install
npx expo start --web
# Or press 'a' for Android emulator
```

**Flutter (Mobile):**
```bash
cd flutter_app
flutter pub get
flutter run
```

## Git Workflow

- Branch from `main` using: `feature/description`, `fix/description`, `doc/description`
- All changes via pull request; at least one reviewer required
- Tech Lead gives final approval and merges
- `main` must always be stable
