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
| Hosting | Netlify (GitHub Actions deployment) |

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

All routes are client-side. The Netlify SPA redirect (`netlify.toml`) ensures a direct request for an application route receives `index.html`, allowing React Router to take over. React Router's final `*` route then renders the dedicated **Page Not Found** screen for unknown client-side paths. In other words, the host redirect delivers the application; it does not decide which client route is a 404. Static assets and the offline fallback remain excluded from the redirect.

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

| Variable | Purpose | Local default |
|----------|---------|---------------|
| `VITE_APP_ENV` | Human-readable application environment | `development` |
| `VITE_PUBLIC_SITE_URL` | Base URL for PWA manifest and OG meta tags; required in production | `http://localhost:5173` |
| `VITE_ENABLE_MOCK_FAILURES` | Makes simulated service calls fail unless an explicit test option overrides it | `false` |
| `VITE_SERVICE_DELAY_MS` | Delay used by in-memory async services | `40` |

Variables prefixed with `VITE_` are exposed to the browser. Do not store secrets in them.

The project reads and validates these values once through `src/env.js`; components and services do not read Vite environment values directly. `.env.development` provides the checked-in local defaults. `.env.production` declares production behavior but intentionally omits `VITE_PUBLIC_SITE_URL`, so a production build fails clearly until the deployment supplies it. Copy `.env.example` to `.env.local` for machine-specific local overrides; `.env.local` is ignored by Git and overrides the checked-in mode file.

For **Netlify**, set `VITE_PUBLIC_SITE_URL` to the deployed HTTPS origin in Site configuration → Environment variables, and optionally set the other variables explicitly. The GitHub Actions workflow also needs the same URL as a repository Actions variable named `VITE_PUBLIC_SITE_URL`, because it builds the deployable `dist/` artifact before Netlify receives it. Neither location needs a secret for these public client-side values. Test code can safely use the service `fail` and `delayMs` options without changing the real environment.

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
| `npm run test:unit` | Run Jest unit and component tests |
| `npm run test:coverage` | Run Jest with text + HTML + lcov coverage reports |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:ci` | Run coverage enforcement, then Chromium E2E tests |

## Testing

### Unit and Component Tests

```bash
npm run test:unit
```

Runs Jest with React Testing Library. To generate measurable coverage evidence, run `npm run test:coverage`. It writes `coverage/index.html` (open it in a browser) and `coverage/lcov.info`; the directory is ignored from source control.

Coverage thresholds (enforced in `jest.config.cjs`):
- Statements: 85%
- Branches: 75%
- Functions: 80%
- Lines: 85%

The function threshold is lower because a few route-wrapper and UI event branches are exercised end-to-end rather than through isolated unit calls; all thresholds are enforced by Jest.

Excluded from coverage: `main.jsx` (entry point), `service-worker.js` (Workbox build output), test files, and mock files.

### E2E Tests

```bash
npx playwright install chromium
npm run test:e2e
```

Playwright tests cover navigation, accessibility (skip link, keyboard, landmarks), task workflows, and responsive breakpoints (375px, 768px, 1440px).

## Deployment and CI/CD

`.github/workflows/netlify.yml` runs on every pull request and on pushes to `main`. It runs `npm ci`, linting, unit/component tests, coverage enforcement, a production build, and Playwright Chromium tests. Coverage and Playwright HTML reports are uploaded as workflow artifacts, even after a failed validation step.

Only a successful push to `main` continues to deployment. The deploy job downloads the exact validated `dist/` artifact and publishes it with the Netlify CLI; pull requests run validation only.

Before enabling deployment, configure these GitHub repository secrets:

- `NETLIFY_AUTH_TOKEN` — a Netlify personal access token authorized to deploy the site.
- `NETLIFY_SITE_ID` — the target site's API ID from Netlify Site configuration.

Also set the non-secret repository Actions variable `VITE_PUBLIC_SITE_URL` to the production HTTPS URL. Do not commit tokens or place secrets in `VITE_*` variables.

To diagnose a failed run, open the first failing GitHub Actions step. Download `coverage-report` and open `coverage/index.html`, or download `playwright-report` and open its `index.html` locally. Re-run a transient failure from the Actions page after resolving its configuration or source cause.

`netlify.toml` provides Netlify's build/publish settings and SPA redirect. The redirect serves `index.html` for direct client routes; React Router renders the matching route or the dedicated client-side 404 page.

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

This is separate from the host-level Netlify SPA redirect: the redirect serves `index.html` for a direct online route request, while the service worker supplies a cached shell only after the app has been installed/visited and the network is unavailable.

## Known Limitations

- Data is session-only. All care plan, care team, and settings data resets on page refresh.
- No backend API, database, or authentication. Async services simulate short session-only operations against in-memory data.
- Notification scheduling uses browser `setTimeout` timers. Notifications will not fire after the tab is closed.
- PWA install prompt availability depends on the browser and platform.
