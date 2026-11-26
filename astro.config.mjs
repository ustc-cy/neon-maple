// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import neonTheme from './themes/neon.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://ustc-cy.github.io',
  base: '/neon-maple/',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: /** @type {import('@shikijs/types').ThemeRegistrationAny} */ (neonTheme),
      wrap: true,
    },
  },
});
