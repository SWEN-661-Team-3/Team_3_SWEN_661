# CareConnect

A responsive, accessible Progressive Web App for daily care management built with React 19 and Vite 8.

**Live deployment:** https://react-vite-app-sable.vercel.app

## Features

- **Today's Plan** -- view, add, edit, and complete daily reminders and tasks
- **Care Team** -- manage caregivers, doctors, and family contacts with availability status
- **Settings** -- accessibility preferences (large text, high contrast, dark theme, reduced motion) and push notification toggle
- **Emergency** -- 5-second countdown emergency alert to contacts
- **PWA** -- installable app with offline support via service worker caching
- **Accessibility** -- skip link, keyboard navigation, ARIA live regions, semantic landmarks, focus management in dialogs

## Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| PWA | vite-plugin-pwa + Workbox |
| Unit/Component Testing | Jest + React Testing Library |
| E2E Testing | Playwright |
| Hosting | Vercel |

## Project Structure

```
react-vite-app/
├── src/
│   ├── App.jsx              # Root state, routing, ErrorBoundary, lazy loading
│   ├── main.jsx             # Entry point (StrictMode, HelmetProvider, BrowserRouter)
│   ├── service-worker.js    # Workbox PWA caching and offline fallback
│   ├── components/          # Reusable UI components
│   ├── pages/               # Route-level page components
│   ├── data/careData.js     # Seed data (session-only, no persistence)
│   ├── hooks/               # Custom hooks (useNotifications)
│   ├── styles/              # CSS tokens and app styles
│   └── __tests__/           # Jest test suites and utilities
├── e2e/                     # Playwright E2E test specs
├── test/                    # Node.js source-level tests
└── public/                  # Static assets, icons, offline.html
```

## Route Structure

| Path | Page |
|------|------|
| `/` | Redirects to `/today` |
| `/today` | Today's Plan (dashboard) |
| `/care-team` | Care Team member grid |
| `/care-team/:caregiverId` | Care Team member details |
| `/settings` | Accessibility and notification settings |
| `/settings/notifications` | Notification settings |
| `/emergency` | Emergency alert panel |
| `*` | 404 Not Found |

All routes are client-side. The Vercel SPA rewrite (`vercel.json`) ensures a direct request for an application route receives `index.html`, allowing React Router to take over. React Router's final `*` route then renders the dedicated **Page Not Found** screen for unknown client-side paths. In other words, the host rewrite delivers the application; it does not decide which client route is a 404. Static assets and the offline fallback remain excluded from the rewrite.

Unknown caregiver IDs are handled separately by `/care-team/:caregiverId`, which renders its care-team-specific not-found message instead of the general 404 page. The service worker provides the corresponding application-shell fallback when offline.

`/settings/notifications` is protected by a capability-based route guard. It requires both the browser Notification API and service workers; it does not use accounts, authentication, or persistent permissions.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
cd react-vite-app
npm install
cp .env.example .env.local
```

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_PUBLIC_SITE_URL` | Base URL for PWA manifest and OG meta tags | `http://localhost:5173` |

Variables prefixed with `VITE_` are exposed to the browser. Do not store secrets in them.

## Development

```bash
npm run dev
npm run test:unit
```

Opens at http://localhost:5173.

## Production Build

```bash
npm run build
npm run preview
```

Build output goes to `dist/`. The preview command serves the production build locally for verification.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Node.js source-level tests |
| `npm run test:unit` | Run Jest tests with coverage |
| `npm run test:coverage` | Run Jest with text + HTML + lcov coverage reports |
| `npm run test:e2e` | Run Playwright E2E tests |

## Testing

### Unit and Component Tests

```bash
npm run test:unit
```

Runs Jest with React Testing Library. Coverage report is generated in `coverage/`. Open `coverage/index.html` to view the HTML report.

Coverage thresholds (enforced in `jest.config.cjs`):
- Statements: 75%
- Branches: 60%
- Functions: 75%
- Lines: 75%

Current coverage exceeds these thresholds (86%+ statements).

Excluded from coverage: `main.jsx` (entry point), `service-worker.js` (Workbox build output), test files, and mock files.

### E2E Tests

```bash
npx playwright install chromium
npm run test:e2e
```

Playwright tests cover navigation, accessibility (skip link, keyboard, landmarks), task workflows, and responsive breakpoints (375px, 768px, 1440px).

## Deployment

The app is deployed to Vercel. The `vercel.json` file configures SPA rewrites so application routes resolve to `index.html`; the client-side catch-all route renders the dedicated 404 page after React loads.

To deploy manually:

```bash
npx vercel --prod
```

Set `VITE_PUBLIC_SITE_URL` in the Vercel project environment variables to your production URL.

## Accessibility

- Semantic HTML: `<main>`, `<nav>`, `<aside>`, `<section>`, `<fieldset>`, `<dialog>`
- Skip link to `#main-content`
- Keyboard: Tab, Enter, Escape support throughout; focus trapped in native `<dialog>` elements
- Focus management: dialog headings receive focus on open (`tabIndex="-1"`) so context is announced without adding headings to tab order; focus returns to the trigger on close.
- ARIA: routine loading/success updates use polite live regions; errors and emergency state changes use assertive alerts only when prompt attention is needed. Dialog opening does not add a redundant live announcement when focus already conveys its context.
- User preferences: large text, high contrast, dark mode, reduced motion (applied via body CSS classes)

Reduced motion removes decorative animation and transitions only; it does not disable dialogs, countdowns, or actions. Large-text and contrast preferences apply to the shared document body so they remain consistent across routes.

## Offline Behavior

The service worker precaches the application shell (`index.html`) and static assets. When offline, React Router handles client-side navigation using the cached shell; that shell may not match the newest deployment. A static `offline.html` page is the last resort when the cached shell is unavailable. An in-app banner informs the user of offline status.

This is separate from the host-level Vercel SPA rewrite: the rewrite serves `index.html` for a direct online route request, while the service worker supplies a cached shell only after the app has been installed/visited and the network is unavailable.

## Known Limitations

- Data is session-only. All care plan, care team, and settings data resets on page refresh.
- No backend API, database, or authentication. Async services simulate short session-only operations against in-memory data.
- Notification scheduling uses browser `setTimeout` timers. Notifications will not fire after the tab is closed.
- PWA install prompt availability depends on the browser and platform.
