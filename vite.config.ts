import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relativní cesty – appka funguje na GitHub Pages (/Silvestr-2026/) i jinde
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
