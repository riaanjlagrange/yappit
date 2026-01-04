import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  const apiTarget =
    process.env.VITE_API_URL || 'http://localhost:3000';

  return {
    build: {
      sourcemap: true, // Source map generation must be turned on
    },
    plugins: [
      react(),
      tailwindcss(),
    sentryVitePlugin({
      telemetry: false,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "riaan-la-grange",
      project: "yappit",
    }),

    ],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
