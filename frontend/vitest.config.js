// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './vitest.setup.js', // Adjust the path according to your project structure
    environment: 'jsdom',
    globals: true,
  },
});
