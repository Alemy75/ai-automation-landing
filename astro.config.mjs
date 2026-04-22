// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://yourdomain.ru',
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
