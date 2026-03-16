import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      disable: process.env.NODE_ENV === 'development',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'manifest.webmanifest',
      includeAssets: [
        'favicon.svg',
        'icons/icon.svg',
        'icons/pwa-192.png',
        'icons/pwa-512.png',
        'icons/maskable-512.png'
      ],
      manifest: {
        name: 'Astral Observer',
        short_name: 'Astral',
        description: 'Dark-mode astronomy dashboard for observation conditions, constellations, celestial events, and astrological transits.',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: '/icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,txt}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/v1\/forecast.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo-forecast',
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.opencagedata\.com\/geocode\/v1\/json.*$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'opencage-reverse-geocode',
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60 * 24 * 7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
