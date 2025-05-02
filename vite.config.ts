import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true
  },
  build: {
    assetsDir: 'assets',
    sourcemap: true,
    outDir: 'dist',
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'framer-motion']
        }
      },
      preserveEntrySignatures: 'strict'
    }
  },
  server: {
    host: true,
    port: 3000
  }
})