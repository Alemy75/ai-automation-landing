// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const isGhPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGhPages ? 'https://alemy75.github.io' : 'https://yourdomain.com',
  base: isGhPages ? '/ai-automation-landing' : undefined,
  output: 'static',
  ...(isGhPages ? {} : { adapter: node({ mode: 'standalone' }) }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
