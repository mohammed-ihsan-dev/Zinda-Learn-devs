import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Dev server — only active during `vite` (npm run dev), NOT in production
  server: {
    port: 5173,
    proxy: {
      // Proxies /api calls to backend during local development
      // In production on Vercel, VITE_API_URL points to the EC2 backend directly
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true
      }
    }
  },

  // Production build settings
  build: {
    outDir: 'dist',
    // Increase chunk warning limit — the app has large dependencies (firebase, recharts)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunks — function form required for Vite 8 / Rolldown compatibility
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/socket.io-client')) {
            return 'vendor-socket';
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3') || id.includes('node_modules/victory')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
        }
      }
    }
  },
})
