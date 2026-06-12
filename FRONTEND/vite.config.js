import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    // Suppress warning for chunks larger than 500kB since React + Clerk bundles exceed the default threshold.
    chunkSizeWarningLimit: 1000,
  }
})