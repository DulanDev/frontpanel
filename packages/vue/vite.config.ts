import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // Peer and runtime dependencies stay imports, so apps dedupe them.
      external: [/^vue$/, /^reka-ui/, /^@frontpanel\//],
    },
  },
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'happy-dom',
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.a11y.test.ts'],
        },
      },
      {
        // The axe scan needs a real browser: computed styles and the accessibility tree.
        extends: true,
        test: {
          name: 'a11y',
          include: ['src/**/*.a11y.test.ts'],
          setupFiles: ['src/a11y/setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
