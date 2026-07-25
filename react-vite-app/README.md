# CareConnect

CareConnect is an accessible React Progressive Web App for managing a daily care plan, care-team contacts, settings, notifications, and emergency actions. It is a front-end demonstration: its asynchronous services simulate realistic short operations over seeded, session-only data.

## Current deployment

No live Netlify deployment has been verified from this repository. A production URL and custom domain must not be claimed until a maintainer configures the Netlify site and GitHub Actions secrets described below.

| Item | Status |
| --- | --- |
| Production Netlify URL | Not available / not verified |
| Netlify preview URL | Not available / not verified |
| Custom domain | Not configured or verified |

## Features

- Today’s Plan with reminders that can be added, edited, completed, and deleted.
- Care Team list and direct caregiver-detail routes.
- Settings for large text, high contrast, dark theme, reduced motion, and notifications.
- Capability-based notification settings guard; no accounts or roles are involved.
- Emergency countdown workflow.
- Route-level loading, error, empty, and operation-feedback states.
- Client-side 404 page and caregiver-specific not-found state.
- PWA manifest, service worker, cached application shell, and offline status banner.

## Accessibility features

- Semantic landmarks, a skip link to `#main-content`, and keyboard-operable controls.
- Native dialogs with labelled headings, focus placement, and focus restoration.
- Visible loading, saving, success, and error messages; routine updates use polite status regions and recovery errors use alerts.
- Field-level form validation with `aria-invalid` and associated error descriptions.
- Large-text, high-contrast, dark-theme, and reduced-motion preferences.
- Dialog opening does not duplicate the context already conveyed through focus.

## Technology stack

| Area | Technology |
| --- | --- |
| UI | React 19 |
| Build tool | Vite 8 |
| Routing | React Router DOM 7 |
| PWA | `vite-plugin-pwa` and Workbox |
| Unit/component tests | Jest and React Testing Library |
| Browser tests | Playwright (Chromium) |
| CI/CD target | GitHub Actions and Netlify |

## Architecture overview

`src/App.jsx` owns session state, initial asynchronous loading, route definitions, lazy route imports, and the application error boundary. `src/components/AppLayout.jsx` supplies the shared header, navigation, offline banner, main landmark, route loading fallback, global operation feedback, and footer.

Pages receive the current session state and call Promise-based functions in `src/services/`. Those services clone their in-memory data and simulate a short delay; they do not call a backend or persist data. The validated environment object in `src/env.js` is the only application-level reader of Vite environment values.

## Route structure

| Path | Behavior |
| --- | --- |
| `/` | Redirects to `/today` |
| `/today` | Today’s Plan |
| `/care-team` | Care Team |
| `/care-team/:caregiverId` | Caregiver detail; unknown IDs show a route-specific not-found state |
| `/settings` | Settings |
| `/settings/notifications` | Notification settings, guarded by browser capability |
| `/emergency` | Emergency workflow |
| `*` | Dedicated client-side 404 page |

Route paths are centralized in `src/routes.js`.

## Project structure

```text
react-vite-app/
├── .github/workflows/netlify.yml  # CI validation and production deployment
├── e2e/                           # Playwright browser scenarios
├── public/                        # Static assets and offline fallback
├── src/
│   ├── components/                # Shared UI, layout, dialogs, feedback
│   ├── data/                      # Seed data
│   ├── hooks/                     # Notification behavior
│   ├── pages/                     # Lazy route-level pages
│   ├── services/                  # Session-only asynchronous service layer
│   ├── styles/                    # Tokens and application styles
│   ├── utils/                     # Form validation
│   ├── App.jsx                    # State, routes, lazy loading
│   ├── env.js                     # Validated environment object
│   └── service-worker.js          # Workbox offline behavior
├── netlify.toml                   # Netlify build and SPA redirect settings
├── package.json
└── vite.config.js
```

## Prerequisites

- Node.js 22 (the CI workflow uses Node 22).
- npm.
- Chromium for browser tests; Playwright installs it with the command below.

## Initial setup

```bash
npm ci
```

For local environment overrides, copy the example file to `.env.local` and edit only non-secret values:

```bash
cp .env.example .env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

## Environment setup

| Variable | Purpose | Development default |
| --- | --- | --- |
| `VITE_APP_ENV` | Human-readable environment name | `development` |
| `VITE_PUBLIC_SITE_URL` | Canonical URL used for PWA/metadata; required for production builds | `http://localhost:5173` |
| `VITE_ENABLE_MOCK_FAILURES` | Enables controlled simulated service failures | `false` |
| `VITE_SERVICE_DELAY_MS` | Delay in milliseconds for simulated services | `40` |

These names match `.env.example`, `.env.development`, `.env.production`, and `src/env.js`. All `VITE_*` values are exposed to browser code, so never put a token, password, or other secret in them. `.env.local` is ignored by Git.

## Development versus production

`npm run dev` loads `.env.development`, which supplies safe local values. A production build loads `.env.production`; that file deliberately omits `VITE_PUBLIC_SITE_URL`, so production builds fail clearly until the deployment environment supplies the real HTTPS URL.

For a one-off local production build, set the variable for the command session:

```powershell
$env:VITE_PUBLIC_SITE_URL = 'https://example.netlify.app'
npm run build
```

Use your real deployed origin, not `example.netlify.app`, for a real release.

## Full script reference

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Serve the existing production build locally |
| `npm run lint` | Lint application/configuration source files |
| `npm test` | Run the Node source-level tests in `test/` |
| `npm run test:unit` | Run Jest unit and component tests |
| `npm run test:coverage` | Run Jest with enforced coverage thresholds and reports |
| `npm run test:e2e` | Run Playwright browser tests |
| `npm run test:ci` | Run coverage enforcement, then Playwright tests |

## Running the application

```bash
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`.

## Production build

Set `VITE_PUBLIC_SITE_URL`, then run:

```bash
npm run build
```

The deployable output is written to `dist/`.

## Previewing production output

Build first, then run:

```bash
npm run preview
```

Open the address printed by Vite. This verifies the built assets locally; Netlify-specific headers, deploy history, and custom-domain behavior still require Netlify.

## Testing overview

The project uses Jest/React Testing Library for units and components, Node tests for source-level checks, and Playwright for browser journeys. Tests use controlled service delays, failure modes, and empty-data modes rather than a backend.

## Unit and component tests

```bash
npm run test:unit
```

These tests cover route behavior, route guards, form validation, dialogs, loading/empty/error states, asynchronous service functions, global feedback, and accessibility behavior.

## Coverage instructions

```bash
npm run test:coverage
```

Jest enforces these global thresholds from `jest.config.cjs`:

| Statements | Branches | Functions | Lines |
| --- | --- | --- | --- |
| 85% | 75% | 80% | 85% |

It produces text, HTML, and lcov reports. Entry-point, service-worker, test, and mock files are excluded because they are covered through build/browser behavior or are not application logic.

## Opening the HTML coverage report

After `npm run test:coverage`, open `coverage/index.html` in a browser. `coverage/` is ignored by Git.

## E2E setup

Install Chromium once for the current Playwright version:

```bash
npx playwright install chromium
```

Then run:

```bash
npm run test:e2e
```

Playwright starts the Vite development server from `playwright.config.js` and checks routes, deep links, 404 behavior, notification guarding, task workflows, accessibility, and responsive layouts.

## Opening the Playwright report

After an E2E run, open:

```text
playwright-report/index.html
```

The report directory is ignored by Git. In CI, download the `playwright-report` artifact first.

## CI/CD pipeline

`.github/workflows/netlify.yml` runs for pull requests and pushes to `main`.

1. Checks out the repository and sets up Node 22.
2. Runs `npm ci`, linting, unit/component tests, coverage enforcement, and a production build.
3. Installs Chromium and runs Playwright.
4. Uploads coverage and Playwright HTML reports as artifacts.
5. Deploys only successful pushes to `main`.

The deployment job downloads the already validated `dist/` artifact; it does not rebuild it.

## Netlify deployment

`netlify.toml` defines the build command (`npm run build`), publish directory (`dist`), and SPA redirect.

Before enabling the GitHub Actions deployment, configure:

- Repository secret `NETLIFY_AUTH_TOKEN`: a Netlify personal access token authorized to deploy the site.
- Repository secret `NETLIFY_SITE_ID`: the Netlify site API ID.
- Repository Actions variable `VITE_PUBLIC_SITE_URL`: the real production HTTPS URL.
- Netlify environment variable `VITE_PUBLIC_SITE_URL`: the same production URL, for builds run by Netlify itself.

Optional non-secret Netlify environment variables are `VITE_APP_ENV=production`, `VITE_ENABLE_MOCK_FAILURES=false`, and `VITE_SERVICE_DELAY_MS=40`.

For a manual artifact deployment after building locally, authenticate with Netlify and run:

```bash
npx netlify-cli@latest deploy --dir=dist --prod
```

Never commit Netlify tokens.

## Vercel deployment

`vercel.json` remains in the repository and contains an SPA rewrite, so Vercel is an optional legacy deployment configuration. It is not the CI/CD target and no Vercel deployment is verified by this README.

If Vercel is used, configure the same required production variable, `VITE_PUBLIC_SITE_URL`, in the Vercel project environment before building. Verify direct route refreshes after deployment.

## Custom-domain setup

No custom domain is configured or verified. In Netlify, add the domain in **Domain management**, follow Netlify’s DNS instructions, wait for HTTPS provisioning, set `VITE_PUBLIC_SITE_URL` to that HTTPS origin in both Netlify and the GitHub Actions variable, then trigger a new deployment.

Record the final production URL and custom-domain status here only after they have been verified.

## SPA rewrite behavior

Netlify’s `/* → /index.html` redirect serves the React application for a direct request such as `/care-team/sarah`. React Router then selects the matching client route, or renders the client-side 404 page for an unknown path. The host redirect does not itself decide whether a path is a client-side 404.

The Vercel rewrite follows the same host-level purpose. Static assets and the offline fallback are served as files rather than application routes.

## PWA and service-worker update behavior

The Vite PWA plugin generates the manifest and service worker during production builds. The manifest identifies CareConnect as an installable standalone application. Workbox precaches the application shell and static assets.

The service worker uses `registerType: 'autoUpdate'`, `skipWaiting`, and `clientsClaim`, so an installed update can take control promptly. Offline navigation first attempts the network, then the cached `index.html` shell so React Router can resolve routes; `public/offline.html` is the final fallback when no shell is cached. Cached content can be older than the latest deployment.

To verify an update after a live deployment, install or load the app once, deploy a small visible change, reload, and inspect the service worker in browser DevTools. To verify offline behavior, load the app once, switch DevTools to offline, navigate within the app, and confirm the offline banner. A first offline visit without cached content should show the static offline page.

## Rollback process

In Netlify, open the site’s **Deploys** page, find the last known-good published deploy, open its deploy menu, and select **Publish deploy**. Netlify makes that deploy live without rewriting Git history.

After rollback, verify `/`, `/today`, `/care-team/sarah`, `/settings/notifications`, an invalid URL, and the install/offline behavior. Record the restored deploy URL and timestamp in release evidence.

## Browser support

Automated browser coverage targets Chromium. The app is intended for current evergreen browsers with ES modules and native dialog support. Notification settings are available only when both the Notification API and service workers exist; unsupported environments receive an accessible explanation instead of attempting the feature.

## Known limitations

- Care-plan, care-team, and settings data is session-only and resets after refresh.
- There is no backend service, database, account system, or authentication.
- Asynchronous service functions simulate network/processing delays over in-memory data; they are not API calls.
- Notification scheduling is browser/tab-session dependent and uses timers; it does not continue after the tab is closed.
- PWA installation, notification permission, and service-worker behavior vary by browser and device.
- No live Netlify URL or custom domain is currently verified from this repository.

## Troubleshooting guide

| Problem | Check |
| --- | --- |
| Production build says `VITE_PUBLIC_SITE_URL` is required | Set the variable to the real HTTPS origin before `npm run build`. |
| Direct Netlify route refresh returns a host 404 | Confirm `netlify.toml` is deployed and the publish directory is `dist`. |
| Notification settings are unavailable | The browser must expose both `Notification` and `navigator.serviceWorker`; denied permission is a different state from unsupported capability. |
| Playwright cannot start a browser | Run `npx playwright install chromium`, then rerun `npm run test:e2e`. |
| Coverage report is missing | Run `npm run test:coverage`, then open `coverage/index.html`. |
| A Netlify deploy fails in CI | Check the first failing action, then verify `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, and `VITE_PUBLIC_SITE_URL` are configured. |
| Offline content looks stale | This is expected for a cached shell; reconnect, reload, and allow the service-worker update to apply. |

## Contribution guidance

Keep changes scoped, preserve accessibility semantics and live-region behavior, and add or update tests with every user-facing behavior change. Use the centralized route constants and environment module instead of duplicating paths or reading `import.meta.env` in components. Before opening a pull request, run:

```bash
npm run lint
npm run test:unit
npm run test:coverage
npm run test:e2e
```
