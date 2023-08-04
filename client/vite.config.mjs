import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/graphql": {
        target: "http://0.0.0.0:5000/",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "static",
    rollupOptions: {
      input: "index.html"
    }
  }
})
