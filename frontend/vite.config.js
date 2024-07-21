import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
   port: 9000,
   strictPort: true,
  },
    // server: {
  //  port: 9000,
  //  strictPort: true,
  //  host: true,
  // //  origin: "http://0.0.0.0:8080",
  // },
  server: {
    port: 9000,
    strictPort: true,
    host: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../securesample/certs/frontend.local.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../securesample/certs/frontend.local.crt')),
    },
    proxy: {
      '/api': {
        target: 'https://backend.local',
        changeOrigin: true,
        secure: true,  // Set to true if using self-signed certs
      },
      '/ws': {
        target: 'wss://frontend.local',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    },
    hmr: {
      protocol: 'wss',
      host: 'frontend.local',
      port: 9000,
      // overlay: false
    },
  },
});
