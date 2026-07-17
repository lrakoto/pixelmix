// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://pixelmix.com',
  trailingSlash: 'never',
  build: {
    // Drop the generated dist/ straight into a public_html-style layout
    // (a single index.html at the root) so GoDaddy serves it without fuss.
    format: 'directory',
  },
});
