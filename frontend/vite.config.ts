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
    coverage: {
      provider: 'istanbul', // or 'c8', but Istanbul is more common
      reporter: ['text', 'html'], // Output reports in text and HTML format
      reportsDirectory: './coverage', // Directory for coverage reports
      include: ['src/**/*.ts', 'src/**/*.tsx'], // Files to include for coverage
      exclude: ['src/tests/**/*'], // Exclude test files from coverage
      all: true, // Ensure coverage is collected for all files, even untested ones
      thresholds: {
        global: {
          lines: 80,   // Require 80% of lines to be covered
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
  },
}
});