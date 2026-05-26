import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'plural-iphone-tidings.ngrok-free.dev', // Allows your frontend tunnel URL
    ],
  },
})
