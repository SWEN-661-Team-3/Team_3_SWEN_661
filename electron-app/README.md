# CareConnect Desktop

CareConnect is an Electron + React desktop app for a daily care plan, care-team contacts, accessibility settings, and simple plan export.

## Architecture overview

- `main.js` is the Electron main process. It creates the `BrowserWindow`, builds the native menu, owns privileged filesystem work, applies security headers and permission policy, and controls navigation/window creation.
- `preload.js` is the isolated bridge between Electron and React. It exposes only `window.careConnect.onMenuAction` and `window.careConnect.savePlanText`.
- `src/main.jsx` and `src/App.jsx` start the React renderer. Renderer components live in `src/components`, static seed data lives in `src/data.js`, and text export formatting lives in `src/planExport.js`.
- `index.html` is the renderer shell. The production Content Security Policy is injected into the built HTML by Vite, while Electron applies matching runtime headers.
- `package.json` contains Vite, Jest, Electron, and electron-builder scripts. Vite writes production renderer assets to `dist`; electron-builder writes packaged output to `release`.

More detail: [Architecture documentation](docs/ARCHITECTURE.md).

## Build and run

Install dependencies from this directory:

```powershell
npm install
```

Run the app in development:

```powershell
npm run electron:dev
```

Build the renderer assets:

```powershell
npm run build
```

Run tests:

```powershell
npm test
```

Create a Windows package:

```powershell
npm run package
```

Create an unpacked Windows build for inspection:

```powershell
npm run package:dir
```

## Security notes

- Renderer Node.js integration is disabled, context isolation is enabled, and renderer sandboxing is explicit in `main.js`.
- The preload bridge exposes a small allowlisted API instead of raw Electron or `ipcRenderer` access.
- IPC handlers validate the sender URL before performing privileged work.
- Navigation is limited to the app origin, unexpected popups are denied, and webviews are blocked.
- A restrictive CSP is applied through main-process response headers and injected into packaged HTML during production builds.
- Runtime permission requests are denied by default.
- Plan export writes only after the native save dialog returns a user-selected path.

More detail: [Security documentation](docs/SECURITY.md).
