/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import { defineConfig as defineVitestConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 9000,        // Ensure the port is correct
  },
  test: {
    environment: 'jsdom',  // Use jsdom environment for testing
    globals: true,          // Enable globals like `describe` and `it`
    setupFiles: './src/setUpTests.ts', // Specify setup files if needed
  },
});
