import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// Bundle size analysis - run with ANALYZE=true npm run build
const shouldAnalyze = process.env.ANALYZE === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable automatic JSX runtime for better tree-shaking
      jsxRuntime: 'automatic',
    }),
    // Bundle analyzer (only in build mode)
    shouldAnalyze && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // treemap, sunburst, network
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable tree-shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug'], // Remove specific console methods
      },
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'apollo-vendor': ['@apollo/client', 'graphql', 'graphql-ws'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-hot-toast'],
          'map-vendor': ['leaflet', 'react-leaflet', 'react-leaflet-markercluster', 'leaflet.markercluster'],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge', 'zustand'],
        },
        // Optimize chunk file names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    // Increase chunk size warning limit (for large dependencies like leaflet)
    chunkSizeWarningLimit: 1000,
    // Source maps for production (optional, can be disabled for smaller bundle)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'esnext',
    // CSS code splitting
    cssCodeSplit: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 3000,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@apollo/client',
      'graphql',
      'framer-motion',
      'lucide-react',
    ],
    exclude: ['@apollo/client/react'],
  },
})
