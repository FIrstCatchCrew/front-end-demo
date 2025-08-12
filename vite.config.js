import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Shared backend on 52.3.6.17
      '/api/catch': {
        target: 'http://52.3.6.17:8080',
        changeOrigin: true,
      },
      '/api/species': {
        target: 'http://52.3.6.17:8080',
        changeOrigin: true,
      },
      '/api/landing': {
        target: 'http://52.3.6.17:8080',
        changeOrigin: true,
      },
      '/api/order': {
        target: 'http://52.3.6.17:8080',
        changeOrigin: true,
      },
      '/api/order-item': {
        target: 'http://52.3.6.17:8080',
        changeOrigin: true,
      },
      '/api/role': {
        target: 'http://52.3.6.17:8080',
        changeOrigin: true,
      },
      '/api/person': {
        target: 'http://52.3.6.17:8080',
        changeOrigin: true,
      },
      // Other backends
      '/api/fisher': {
        target: 'http://52.3.6.72:8080',
        changeOrigin: true,
      },
      '/api/user': {
        target: 'http://52.3.6.12:8080',
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