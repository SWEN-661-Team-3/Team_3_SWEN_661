# Architecture

CareConnect is split into the standard Electron layers: main process, preload bridge, and React renderer.

## Main process

`main.js` runs in Node.js as the trusted Electron process.

Responsibilities:

- Create the primary `BrowserWindow`.
- Build the native application menu.
- Route menu actions to the renderer through a narrow IPC event.
- Handle the privileged `save-plan-text` operation.
- Apply desktop security controls, including CSP headers, permission denial, IPC sender validation, navigation control, popup denial, and webview blocking.

The main process is the only layer that writes files. The renderer sends formatted plan text, and the main process opens Electron's save dialog before writing to the selected path.

## Preload bridge

`preload.js` runs in an isolated context before the renderer starts. It exposes a minimal `window.careConnect` API:

- `onMenuAction(callback)` subscribes to vetted menu events and returns a cleanup function.
- `savePlanText(planText)` invokes the main-process save handler.

The bridge does not expose raw Electron modules or the raw `ipcRenderer` object.

## Renderer

The React renderer lives under `src`.

Key modules:

- `src/main.jsx` mounts React.
- `src/App.jsx` owns app-level state and dialog orchestration.
- `src/components` contains UI components.
- `src/data.js` contains static seed data for reminders, care-team entries, labels, and accessibility defaults.
- `src/planExport.js` converts the current plan into plain text for export.
- `src/styles` contains design tokens and app CSS.

The renderer has no direct filesystem, shell, or Node.js access. Desktop operations go through the preload API.

## Build flow

Development uses Vite at `http://localhost:5173` and Electron loads that local development origin.

Production packaging uses:

1. `vite build` to generate static renderer assets in `dist`.
2. `electron-builder --win` to package Electron, `main.js`, `preload.js`, `securityPolicy.cjs`, `package.json`, and `dist`.
3. `release` as the packaging output directory.

## Testing

Jest tests cover React components, plan export formatting, the preload bridge, and main-process behavior. The main-process tests mock Electron APIs so menu routing, save handling, IPC sender validation, CSP header injection, permission policy, and navigation/window controls can be verified without launching a full desktop app.
