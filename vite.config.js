import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'robots.txt'],
      manifest: {
        name: 'News Monitor',
        short_name: 'NewsMonitor',
        description: 'Real-time global news monitoring dashboard',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,pdf,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/newsapi\.org\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'newsapi', networkTimeoutSeconds: 10, expiration: { maxEntries: 100, maxAgeSeconds: 3600 } }
          },
          { urlPattern: /^https?:\/\/.*\.googleapis\.com\/.*/i, handler: 'NetworkFirst', options: { cacheName: 'googleapis' } },
          { urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/i, handler: 'CacheFirst', options: { cacheName: 'images', expiration: { maxEntries: 200, maxAgeSeconds: 86400 } } }
        ]
      }
    })
  ],
  define: { 'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL || '/') },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'], ui: ['recharts'], utils: ['axios', 'zustand'] }
      },
      chunkSizeWarningLimit: 1000
    }
  },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true }
})
