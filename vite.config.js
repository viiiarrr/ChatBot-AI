/**
 * Vite Configuration for Groq AI Chat
 */
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild'
  },
  preview: {
    port: 4173,
    host: true
  }
})
