import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  // Served from GitHub Pages at dulandev.github.io/frontpanel/.
  base: '/frontpanel/',
  plugins: [vue()],
})
