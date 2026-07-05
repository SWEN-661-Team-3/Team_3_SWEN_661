# Security Considerations

CareConnect is a local desktop app that displays trusted renderer assets and static care-plan data. It still treats the Electron main process as privileged and the renderer as less trusted.

## Implemented controls

### Renderer isolation

The main window is created with:

- `nodeIntegration: false`
- `contextIsolation: true`
- `sandbox: true`
- `webSecurity: true`
- `allowRunningInsecureContent: false`
- `webviewTag: false`

This keeps Node.js out of the renderer and limits what renderer code can reach directly.

### Content Security Policy

The renderer CSP is generated from `securityPolicy.cjs`.

In development, Electron applies the CSP through `session.defaultSession.webRequest.onHeadersReceived`. The development policy allows Vite's React Refresh inline bootstrap and local websocket.

In production, Vite injects a stricter CSP meta tag into the built `dist/index.html`, and Electron applies the matching response header at runtime.

The policy:

- Limits production scripts to `self`.
- Blocks objects and framing.
- Allows styles from the app and Google Fonts.
- Allows fonts from the app and Google Fonts.
- Allows images from the app and `data:`.
- Allows Vite's local websocket only for development.

Inline styles are allowed because the current React UI uses style attributes for component-specific CSS variables and Vite injects styles in development. Inline scripts are allowed only in development so React Refresh can start.

### IPC boundary

The preload bridge exposes only:

- `onMenuAction`
- `savePlanText`

Main-process IPC handlers validate `event.senderFrame.url` before acting. In development the trusted origin is `http://localhost:5173`; in packaged builds the sender must be a file inside the packaged `dist` directory.

### Navigation and windows

All created web contents receive these controls:

- `will-navigate` allows only the app URL.
- Approved external URLs are opened through the operating system instead of inside Electron.
- `setWindowOpenHandler` denies new Electron windows.
- `will-attach-webview` prevents webview creation.

Allowed external URLs are intentionally narrow: the project GitHub URL and sanitized `tel:` links.

### Permissions

Runtime permission requests are denied by default through `setPermissionRequestHandler`. The app does not currently require camera, microphone, geolocation, notifications, or similar browser permissions.

### File writes

The renderer cannot write files directly. Plan export sends plain text to the main process, and the main process writes only after Electron's native save dialog returns a user-selected path.

## Data handling

The current app uses static seed data and in-memory edits. It does not authenticate users, sync to a backend, or persist care-team changes across sessions. Exported plan text can include health-related reminders, appointment notes, locations, or care context, so users should save it only in locations they trust.

## Operational notes

- Keep Electron and dependencies current.
- Run `npm test` before packaging.
- Run `npm audit` during release preparation when network access is available.
- Revisit the CSP whenever new remote assets, APIs, or inline scripts are introduced.
- Add explicit allowlist entries for any future external links instead of passing user-controlled URLs to `shell.openExternal`.
- Add security tests with any new IPC channel, permission, navigation path, or persistence feature.
