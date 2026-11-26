// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from '@pagefind/astro';
import neonTheme from './themes/neon.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://ustc-cy.github.io',
  base: '/neon-maple/',
  integrations: [mdx(), sitemap(), pagefind()],
  markdown: {
    shikiConfig: {
      theme: neonTheme,
      wrap: true,
    },
  },
});
