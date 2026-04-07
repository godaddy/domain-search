import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'DomainSearch',
      formats: ['es', 'umd'],
      fileName: (format) => `domain-search.${format}.js`
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/],
      output: {
        globals: (id: string): string => {
          if (id === 'react' || id.startsWith('react/')) return 'React';
          if (id === 'react-dom' || id.startsWith('react-dom/')) return 'ReactDOM';
          return id;
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/tests/**', 'src/index.ts']
    }
  }
});
