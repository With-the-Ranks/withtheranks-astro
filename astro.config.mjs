import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://withtheranks.com',
  base: '/',

  integrations: [mdx(), react()],

  vite: {
    plugins: [tailwindcss()],
    assetsInclude: ['**/*.glb']
  },

  output: 'server',
  adapter: cloudflare()
});
