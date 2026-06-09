import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  integrations: [react()],
  site: process.env.SITE_URL || 'https://geo.nmc-interactive.com',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
