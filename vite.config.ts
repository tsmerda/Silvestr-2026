import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relativní cesty – appka funguje na GitHub Pages (/korutany-2026/) i jinde
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
