import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tinaDirective from './astro-tina-directive/index.mjs';

const base = process.env.DEPLOY_BASE || '/';

export default defineConfig({
  site: 'https://fespan.org',
  base,
  // No `fallback`: in static output it emits redirect stubs instead of rendered pages.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    mdx(),
    tailwind(),
    react(),
    sitemap({ filter: (page) => !page.includes('/admin') }),
    tinaDirective(),
  ],
});
