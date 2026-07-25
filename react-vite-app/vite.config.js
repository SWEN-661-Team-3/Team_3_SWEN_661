import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

function parseDelay(value) {
  const delay = Number(value ?? 40);
  if (!Number.isFinite(delay) || delay < 0) {
    throw new Error('VITE_SERVICE_DELAY_MS must be a non-negative number.');
  }
  return delay;
}

export default defineConfig(({ mode }) => {
  const variables = loadEnv(mode, process.cwd(), 'VITE_');
  const appEnv = variables.VITE_APP_ENV ?? mode;
  const isProduction = mode === 'production' || appEnv === 'production';
  const publicSiteUrl = variables.VITE_PUBLIC_SITE_URL?.replace(/\/$/, '')
    ?? (isProduction ? '' : 'http://localhost:5173');

  if (!publicSiteUrl) {
    throw new Error('VITE_PUBLIC_SITE_URL is required for production builds. Set it in your deployment environment.');
  }

  const appEnvConfig = {
    appEnv,
    publicSiteUrl,
    enableMockFailures: variables.VITE_ENABLE_MOCK_FAILURES === 'true',
    serviceDelayMs: parseDelay(variables.VITE_SERVICE_DELAY_MS),
  };

  return {
    define: {
      __CARECONNECT_ENV__: JSON.stringify(appEnvConfig),
    },
    plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'CareConnect - Daily Care Management',
        short_name: 'CareConnect',
        description: 'Manage daily care plans, medications, appointments, and caregiver contacts with accessibility-first design.',
        theme_color: '#1d4ed8',
        background_color: '#f0ebe2',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'any',
        categories: ['health', 'medical', 'lifestyle'],
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: '/icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
    ],
  };
});
