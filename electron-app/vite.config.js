import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import securityPolicy from './securityPolicy.cjs';

const { getContentSecurityPolicy } = securityPolicy;

function productionCspPlugin() {
  return {
    name: 'careconnect-production-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const csp = getContentSecurityPolicy({ isDev: false });
      const metaTag = [
        '<meta',
        '    http-equiv="Content-Security-Policy"',
        `    content="${csp}"`,
        '  />',
      ].join('\n');

      return html.replace(
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        `  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  ${metaTag}`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), productionCspPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
