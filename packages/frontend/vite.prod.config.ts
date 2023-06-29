import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://filemarket.xyz/',
        changeOrigin: true,
      },
      '/static': {
        target: 'https://filemarket.xyz/',
        changeOrigin: true,
      },
      '/ws': {
        target: 'wss://filemarket.xyz/',
        secure: false,
        changeOrigin: true,
        ws: true,
      }
    },
  },
})
