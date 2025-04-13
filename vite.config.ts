import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'src/setupTests.ts',
        'src/**/*.test.tsx',
        'src/App.tsx',
        'src/main.tsx',
        '**.config.**',
      ],
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
} as UserConfig);
