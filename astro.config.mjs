import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://withtheranks.com',
  base: '/',
  integrations: [mdx(), tailwind({
    nesting: true,
    applyBaseStyles: false
  }), react()],
  vite: {
    assetsInclude: ['**/*.glb']
  }
});