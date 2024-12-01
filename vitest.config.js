import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global `describe`, `it`, etc.
    environment: 'jsdom', // Simulate a browser-like environment
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'], // Test file patterns
    exclude: ['node_modules', 'dist', '.git', 'cypress'], // Excluded directories
    coverage: {
      reporter: ['text', 'html'], // Enable coverage reports
    },
  },
});
