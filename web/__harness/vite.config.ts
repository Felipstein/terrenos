import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: resolve(__dirname),
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@vis.gl/react-google-maps': resolve(__dirname, 'vis-stub.tsx'),
    },
  },
  server: { port: 5199 },
})
