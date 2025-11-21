import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import i18nextLoader from 'vite-plugin-i18next-loader'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    // @swc/plugin-styled-components is commented out until version compatability can be resolved
    react(), //{ plugins: [['@swc/plugin-styled-components', { displayName: true }]] }
    VitePWA({
      filename: 'service-worker.js', // match the old CRA service worker name so we avoid stale caches
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'MERMAID',
        name: 'MERMAID',
        icons: [
          {
            src: 'mermaid_favicon.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
      },
      workbox: {
        globPatterns: ['**/*'], //  cache all the imports
        maximumFileSizeToCacheInBytes: 3500000,
      },

      includeAssets: ['**/*'], //cache all the static assets in the public folder
    }),
    i18nextLoader({ paths: ['./src/locales'] }),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  define: {
    'process.env': process.env.VITE_ENVIRONMENT,
  },
})
