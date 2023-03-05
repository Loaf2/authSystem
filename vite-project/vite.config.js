import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/dashboard': 'http://localhost:3000',
      '/items': 'http://localhost:3000',
      '/create-checkout-session': 'http://localhost:3000',
      '/isUserAuth': 'http://localhost:3000',
      '/retrieveStripeInfo': 'http://localhost:3000',
      '/inputUserItems': 'http://localhost:3000',
    },
  },
})
