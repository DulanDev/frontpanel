import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // Served from GitHub Pages at dulandev.github.io/frontpanel/.
  base: '/frontpanel/',
  plugins: [vue()],
  // The dev server runs the components from source so edits reload; the build uses the built package.
  resolve: command === 'serve'
    ? { alias: { '@frontpanel/vue': fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)) } }
    : undefined,
}))
