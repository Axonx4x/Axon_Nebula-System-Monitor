
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Crucial: Makes paths relative so they work inside the Electron app
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  }
});
