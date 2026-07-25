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

Start by copying the tracked example. `.env.local` is intentionally ignored by Git and overrides the mode-specific defaults on your machine.

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Vite exposes every variable whose name starts with `VITE_` to browser JavaScript. Treat these values as public configuration: never put `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, passwords, API keys, or other secrets in a `VITE_` variable.

| Variable | Required in development | Required in production | Example | Purpose |
| --- | --- | --- | --- | --- |
| `VITE_APP_ENV` | No | No | `development` or `production` | Sets the human-readable application environment. It defaults to Vite’s current mode when omitted. |
| `VITE_PUBLIC_SITE_URL` | No | Yes | `https://careconnect.example.net` | Canonical public origin used for Open Graph metadata. Development falls back to `http://localhost:5173`; production intentionally has no fallback. |
| `VITE_ENABLE_MOCK_FAILURES` | No | No | `false` | When exactly `true`, simulated service calls can fail for controlled development/test scenarios. Keep it `false` in production. |
| `VITE_SERVICE_DELAY_MS` | No | No | `40` | Non-negative delay, in milliseconds, used by the session-only asynchronous service simulation. It defaults to `40`. |

`.env.development` provides the checked-in local defaults used by `npm run dev` and Playwright’s development server. `.env.production` sets production-safe values but deliberately omits `VITE_PUBLIC_SITE_URL`. As a result, `npm run build` fails with a clear configuration error until the production URL is supplied by the command environment or hosting provider.

The application validates and normalizes this configuration once in `src/env.js`; components and services do not read `import.meta.env` directly. `src/vite-env.d.ts` declares Vite’s client environment types and the build-time `__CARECONNECT_ENV__` object injected by `vite.config.js`, keeping the JavaScript configuration contract explicit for tooling and editors.

### Hosting-provider configuration

For **Netlify**, configure `VITE_PUBLIC_SITE_URL` in **Site configuration → Environment variables**. The GitHub Actions deployment workflow also requires the same public URL as the repository Actions variable `VITE_PUBLIC_SITE_URL`, because CI builds `dist/` before uploading it to Netlify. Keep `VITE_ENABLE_MOCK_FAILURES=false` in Netlify production configuration.

For optional **Vercel** deployments, configure `VITE_PUBLIC_SITE_URL` in **Project Settings → Environment Variables** for Production, and keep `VITE_ENABLE_MOCK_FAILURES=false`. `vercel.json` remains as an optional legacy SPA-rewrite configuration; Netlify is the configured CI/CD target.

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

Build the same artifact that Netlify publishes. A production build requires the real public origin:

```bash
npm run build
```

For PowerShell, set it for the current shell before building:

```powershell
$env:VITE_PUBLIC_SITE_URL = 'https://your-site.netlify.app'
npm run build
```

The deployable output is written to `dist/`. Do not edit files in `dist/`; build them from source.

## Previewing production output

Build first, then run:

```bash
npm run preview
```

Open the address printed by Vite. `npm run preview` only serves the local `dist/` output: it is useful for checking the production bundle, but it is not a Netlify deploy. It cannot prove Netlify deploy history, DNS/SSL, the Netlify redirect, or the active production version.

## Testing overview

Start from a clean checkout with:

```bash
npm ci
```

The suite has four complementary categories. Jest tests pure functions and services; React Testing Library tests components and route-level behavior in jsdom; workflow tests exercise multiple components together; Playwright verifies browser-visible journeys in Chromium. None of the tests require a backend.

| Category | Tool | Command | Scope |
| --- | --- | --- | --- |
| Source-level tests | Node test runner | `npm test` | Tests in `test/` |
| Unit tests | Jest | `npm run test:unit` | Validation utilities, services, hooks, and focused components |
| Component and integration/workflow tests | Jest + React Testing Library | `npm run test:unit` | Routed pages, dialogs, guards, loading/error states, and user workflows in jsdom |
| E2E tests | Playwright | `npm run test:e2e` | Direct routes, deep links, 404s, accessibility, responsive layouts, and browser task workflows |

To run one workflow-focused Jest file, forward its path to the existing script:

```bash
npm run test:unit -- src/__tests__/TodayPage.test.jsx
```

To run the browser task workflow only:

```bash
npm run test:e2e -- e2e/task-workflow.spec.js
```

## Unit and component tests

```bash
npm run test:unit
```

These tests cover route behavior, route guards, form validation, dialogs, loading/empty/error states, asynchronous service functions, global feedback, and accessibility behavior. Jest uses jsdom plus the project setup files in `src/__tests__/polyfills.js` and `src/__tests__/setup.js` for browser APIs such as `TextEncoder` and native-dialog methods.

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

For visible browser debugging, run:

```bash
npx playwright test --headed
```

For Playwright Inspector debugging, run:

```bash
npx playwright test --debug
```

Both commands use the checked-in `playwright.config.js`; they are debugging variants of `npm run test:e2e` rather than additional package scripts.

## Opening the Playwright report

After an E2E run, open:

```text
playwright-report/index.html
```

The report directory is ignored by Git. In CI, download the `playwright-report` artifact first.

## Controlled test data and failures

Service functions accept test options such as `{ delayMs: 0 }`, `{ fail: true }`, and `{ errorMessage: 'Planned failure' }`. Unit and component tests use these options or mock service modules to keep asynchronous tests fast and deterministic.

Browser tests use the localhost-only `__e2e` query parameter handled by `src/services/e2eTestMode.js`. It is ignored outside `localhost`, so it does not change deployed behavior. Supported examples are:

| URL suffix | Visible test state |
| --- | --- |
| `?__e2e=empty-plan` | No reminders |
| `?__e2e=empty-team` | No care-team members |
| `?__e2e=unsupported-notifications` | Notification capability guard |
| `?__e2e=fail-complete` | Completion operation failure with retry feedback |
| `?__e2e=slow-save-reminder` | Deliberately slow reminder save |

Operation modes follow `fail-<operation>` and `slow-<operation>` when the affected service uses the helper. The development-only environment variable `VITE_ENABLE_MOCK_FAILURES=true` can force simulated service failures, but it must remain `false` in production.

## Common test setup issues

| Problem | Resolution |
| --- | --- |
| Jest reports missing browser APIs such as `TextEncoder` or dialog methods | Run the project command (`npm run test:unit` or `npm run test:coverage`) so Jest loads `jest.config.cjs` and its setup/polyfill files. |
| Playwright cannot find Chromium | Run `npx playwright install chromium`, then rerun `npm run test:e2e`. |
| Playwright cannot start the local server | Stop any conflicting process on port 5173, or let Playwright start Vite through the configured `webServer`. |
| A browser test does not activate an `__e2e` mode | Use a localhost URL; test modes intentionally do nothing on deployed hosts. |
| A report is missing | Run `npm run test:coverage` for `coverage/index.html` or `npm run test:e2e` for `playwright-report/index.html`. |

## CI/CD pipeline

`.github/workflows/netlify.yml` runs for pull requests and pushes to `main`.

1. Checks out the repository and sets up Node 22.
2. Runs `npm ci`, linting, unit/component tests, coverage enforcement, and a production build.
3. Installs Chromium and runs Playwright.
4. Uploads coverage and Playwright HTML reports as artifacts.
5. Deploys only successful pushes to `main`.

The deployment job downloads the already validated `dist/` artifact; it does not rebuild it.

## Netlify deployment

`netlify.toml` defines the build command (`npm run build`), publish directory (`dist`), and SPA redirect. The GitHub Actions workflow validates each pull request, then deploys only a successful push to `main`.

Set up a reproducible GitHub Actions deployment as follows:

1. Create or select a Netlify site. Its publish directory is `dist` and its build command is `npm run build`.
2. In the GitHub repository, add secret `NETLIFY_AUTH_TOKEN` (a Netlify personal access token authorized to deploy) and secret `NETLIFY_SITE_ID` (the target site API ID).
3. Add the non-secret repository Actions variable `VITE_PUBLIC_SITE_URL` with the real production HTTPS URL. CI uses it while building the artifact.
4. In Netlify **Site configuration → Environment variables**, add the same `VITE_PUBLIC_SITE_URL` for any build initiated by Netlify itself.
5. Push the workflow and application changes to `main`; the **Deploy production site** GitHub Actions job runs only after all validation checks pass.

Optional non-secret Netlify environment variables are `VITE_APP_ENV=production`, `VITE_ENABLE_MOCK_FAILURES=false`, and `VITE_SERVICE_DELAY_MS=40`.

For a manual artifact deployment after building locally, authenticate with Netlify and run:

```bash
npx netlify-cli@latest deploy --dir=dist --prod
```

Never commit Netlify tokens.

### Confirming the active production version

In Netlify, open **Deploys** and identify the deploy marked **Published**. Open it to record its deploy URL, published timestamp, commit SHA, and deploy log. Visit the site’s production domain and refresh `/`, `/today`, `/care-team/sarah`, `/settings/notifications`, and `/not-a-page`; this confirms the active artifact serves the expected redirect, deep link, guard, and client-side 404. The URL is not known or verified for this repository yet, so do not add a guessed value to this README.

## Vercel deployment

`vercel.json` remains in the repository and contains an SPA rewrite, so Vercel is an optional legacy deployment configuration. It is not the CI/CD target and no Vercel deployment is verified by this README.

If Vercel is retained, create/import a Vercel project for this repository, use `npm run build` with `dist` as the output directory, and configure `VITE_PUBLIC_SITE_URL` in **Project Settings → Environment Variables** for Production. Deploy from the Vercel dashboard or an approved Vercel integration, then refresh the same direct routes listed above. The existing `vercel.json` supplies the SPA rewrite; it does not configure Netlify or replace the Netlify workflow.

## Custom-domain setup

No custom domain is configured or verified. In Netlify **Domain management**, add the domain, then create the DNS records Netlify displays at the domain registrar. Verify DNS propagation in Netlify and wait for Netlify to provision HTTPS/SSL. Do not mark the domain ready until Netlify reports it as configured and the HTTPS URL loads without a certificate warning.

Once DNS and SSL are verified, set `VITE_PUBLIC_SITE_URL` to the custom HTTPS origin in both Netlify and the GitHub Actions variable, trigger a new deployment, and repeat the direct-route checks on the custom domain.

Record the final production URL and custom-domain status here only after they have been verified.

## SPA rewrite behavior

Netlify’s `/* → /index.html` redirect serves the React application for a direct request such as `/care-team/sarah`. React Router then selects the matching client route, or renders the client-side 404 page for an unknown path. The host redirect does not itself decide whether a path is a client-side 404.

The Vercel rewrite follows the same host-level purpose. Static assets and the offline fallback are served as files rather than application routes.

## PWA and service-worker update behavior

The Vite PWA plugin generates the manifest and service worker during production builds. The manifest identifies CareConnect as an installable standalone application. Workbox precaches the application shell and static assets.

The service worker uses `registerType: 'autoUpdate'`, `skipWaiting`, and `clientsClaim`, so an installed update can take control promptly. Offline navigation first attempts the network, then the cached `index.html` shell so React Router can resolve routes; `public/offline.html` is the final fallback when no shell is cached. Cached content can be older than the latest deployment.

Service-worker precaution: do not judge a deployment only by an already-open, installed tab. Before release verification, reload after deployment and check DevTools **Application → Service Workers** for the active worker. To verify an update, load the app once, deploy a small visible change, reload, and inspect the worker. To verify offline behavior, load the app once, switch DevTools to offline, navigate within the app, and confirm the offline banner. A first offline visit without cached content should show the static offline page.

## Rollback process

In Netlify, open the site’s **Deploys** page, find the last known-good deploy, open its deploy menu, and select **Publish deploy**. Confirm that it now carries the **Published** label; Netlify makes that artifact live without rewriting Git history.

After rollback, record the restored deploy URL, timestamp, and commit SHA from the published deploy. Refresh `/`, `/today`, `/care-team/sarah`, `/settings/notifications`, an invalid URL, and the install/offline behavior. This is how to confirm the previously known-good production version is active.

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

### Missing environment variables

**Symptom:** `npm run build` reports that `VITE_PUBLIC_SITE_URL` is required, or metadata has the wrong origin.

**Likely cause:** Production intentionally has no fallback for `VITE_PUBLIC_SITE_URL`.

**Resolution:** Copy `.env.example` to `.env.local` for local work, or set the real HTTPS production origin in the hosting environment. For a PowerShell build:

```powershell
$env:VITE_PUBLIC_SITE_URL = 'https://your-site.netlify.app'
npm run build
```

Do not place secrets in `VITE_` variables.

### Vite startup errors

**Symptom:** `npm run dev` exits before showing a local URL, or reports a malformed delay/configuration value.

**Likely cause:** Dependencies are missing, or `.env.local` contains an invalid `VITE_SERVICE_DELAY_MS` value.

**Resolution:** Run `npm ci`, ensure `VITE_SERVICE_DELAY_MS` is a non-negative number such as `40`, and restart with:

```bash
npm run dev
```

### Service worker caching an old build

**Symptom:** A deployed change is not visible in an installed tab, or offline content looks older than the current deploy.

**Likely cause:** The application shell is cached by the installed service worker. Cached content can legitimately be older until the update applies.

**Resolution:** Reconnect to the network, reload the page, then inspect **DevTools → Application → Service Workers** for the active worker. Avoid judging a release from an already-open installed tab alone.

### Notification permission failures

**Symptom:** `/settings/notifications` shows “Notification Settings Unavailable,” permission is denied, or requesting permission does not enable reminders.

**Likely cause:** The route requires both `window.Notification` and `navigator.serviceWorker`. A browser-level denied permission is different from unsupported capability.

**Resolution:** Use a current browser on HTTPS (or localhost during development), confirm service workers are available, and reset the site’s notification permission in the browser’s site settings before trying again. If the route is unsupported, use **Back to Settings**; the app cannot add notification support to that browser.

### Playwright browser installation

**Symptom:** `npm run test:e2e` says Chromium is missing or cannot launch.

**Likely cause:** Playwright’s bundled browser has not been installed for the current dependency version.

**Resolution:** Run:

```bash
npx playwright install chromium
npm run test:e2e
```

For interactive diagnosis, use `npx playwright test --headed` or `npx playwright test --debug`.

### Jest or jsdom issues

**Symptom:** Jest reports missing `TextEncoder`, native-dialog methods, or browser APIs.

**Likely cause:** The test was not started with the project’s Jest configuration and setup files.

**Resolution:** Use the project commands, which load `jest.config.cjs`, `src/__tests__/polyfills.js`, and `src/__tests__/setup.js`:

```bash
npm run test:unit
npm run test:coverage
```

If dependencies are missing, run `npm ci` first.

### SPA 404 errors after deployment

**Symptom:** Refreshing `/care-team/sarah` or another application route returns a host-provider 404 instead of the React page.

**Likely cause:** The deployed host is not using the SPA fallback or is publishing the wrong directory.

**Resolution:** For Netlify, deploy `netlify.toml`, use `dist` as the publish directory, and keep the `/* → /index.html` redirect. For Vercel, retain `vercel.json`. Redeploy, then directly refresh `/today`, `/care-team/sarah`, and `/not-a-page`; the last URL should render the app’s client-side 404 page.

### Resetting local PWA data

**Symptom:** Local service-worker behavior remains stale after a source or configuration change.

**Likely cause:** The browser retains this app’s service worker and cached site storage for the local origin.

**Resolution:** In browser DevTools, open **Application → Service Workers**, select this site’s worker, and choose **Unregister**. Then open **Application → Storage**, verify the selected origin is the local CareConnect origin (for example `http://localhost:5173`), and choose **Clear site data**. Reload the app. These steps remove only this origin’s PWA cache/site storage; do not clear unrelated browser data.

### Port conflicts

**Symptom:** Vite or Playwright cannot bind to port `5173`.

**Likely cause:** Another Vite/app process is already using the port. Playwright is configured to reuse an existing server on that port.

**Resolution:** Stop the existing local development server, then run `npm run dev` or `npm run test:e2e` again. If you intentionally keep the server running, ensure it is the CareConnect Vite server at `http://localhost:5173`.

### Offline testing

**Symptom:** The offline banner or cached navigation does not appear as expected.

**Likely cause:** The app was not loaded online first, the service worker is not active yet, or DevTools offline mode was enabled before assets could be cached.

**Resolution:** Load the production build online once, confirm a service worker is active in **DevTools → Application**, then switch **DevTools → Network** to Offline and navigate within the app. Expect the offline status banner and cached shell. A first-ever offline visit may show `offline.html` instead.

### Netlify build failure

**Symptom:** A Netlify build or the GitHub Actions deploy job fails before publishing.

**Likely cause:** Missing `VITE_PUBLIC_SITE_URL`, invalid environment values, missing Netlify credentials, or a failed lint/test/build step.

**Resolution:** Read the first failed log line. Confirm the Netlify build command is `npm run build`, the publish directory is `dist`, and GitHub has `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, and the non-secret `VITE_PUBLIC_SITE_URL` Actions variable. Reproduce locally with `npm ci`, `npm run lint`, `npm run test:coverage`, and `npm run build` after setting the public URL.

### CI test failure

**Symptom:** A pull-request workflow fails at Jest, coverage, or Playwright.

**Likely cause:** A test regression, unmet coverage threshold, or unavailable Playwright browser.

**Resolution:** Open the first failed GitHub Actions step, download the `coverage-report` or `playwright-report` artifact when available, and reproduce the named command locally. Use `npm run test:coverage` for coverage failures and `npx playwright install chromium` followed by `npm run test:e2e` for browser failures.

### Custom-domain or SSL delay

**Symptom:** A newly connected domain does not resolve, shows a certificate warning, or does not yet serve the current site.

**Likely cause:** DNS records have not propagated, Netlify has not validated the records, or HTTPS/SSL provisioning is still pending.

**Resolution:** Compare the registrar’s DNS records with the values in Netlify **Domain management**, wait for Netlify to report the domain as configured and HTTPS-ready, then set `VITE_PUBLIC_SITE_URL` to the verified custom HTTPS origin and redeploy. Do not claim the custom domain is live before the HTTPS URL loads successfully.

### Stale preview deployment

**Symptom:** A preview URL shows an older commit than the pull request or branch you expect.

**Likely cause:** The URL belongs to an earlier deploy, or the newest workflow did not finish successfully.

**Resolution:** In Netlify **Deploys** and GitHub Actions, compare the deploy’s commit SHA and timestamp with the intended commit. Open the newest successful deploy rather than reusing a bookmarked preview URL. For production, only the deploy labelled **Published** is active; publish a known-good deploy or rerun the successful pipeline when appropriate.

## Contribution guidance

Keep changes scoped, preserve accessibility semantics and live-region behavior, and add or update tests with every user-facing behavior change. Use the centralized route constants and environment module instead of duplicating paths or reading `import.meta.env` in components. Before opening a pull request, run:

```bash
npm run lint
npm run test:unit
npm run test:coverage
npm run test:e2e
```
