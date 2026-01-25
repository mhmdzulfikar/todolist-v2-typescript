import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pastikan GAK ADA import tailwind di sini!
export default defineConfig({
  plugins: [react()],
})