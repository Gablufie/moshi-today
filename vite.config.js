// vite.config.js — THIS ONE WORKS 100% ON VERCEL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',

  server: {
    proxy: {
      '/mpesa': {
        target: 'https://sandbox.safaricom.co.ke',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/mpesa/, ''),
      },
    },
  },
})