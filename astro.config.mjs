import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://staging.withtheranks.com',
  base: '/',
  integrations: [mdx(), tailwind({
    nesting: true
  }), react()],
  vite: {
    assetsInclude: ['**/*.glb']
  }
});