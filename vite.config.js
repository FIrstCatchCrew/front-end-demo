import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Shared backend on 54.196.108.105
      '/api/catch': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      '/api/species': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      '/api/landing': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      '/api/order': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      '/api/order-item': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      '/api/role': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      '/api/person': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      // Other backends
      '/api/fisher': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
      '/api/user': {
        target: 'http://54.196.108.105:8080',
        changeOrigin: true,
      },
    },
  },
  // Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js', // Optional: for global setup
  },
})