import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDir = process.cwd();

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(rootDir, 'app'),
      '@': resolve(rootDir, 'app'),
      '~~': resolve(rootDir),
      '@@': resolve(rootDir),
      '#shared': resolve(rootDir, 'shared'),
    },
  },

  test: {
    environment: 'node',
    include: ['app/tests/**/*.test.ts'],
  },
});
