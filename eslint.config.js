import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      // The docs' Markdown as generated, checked by its test, not written by hand.
      'apps/docs/.vitepress/llms/__golden__/**',
    ],
  },
  {
    // The music add-on is presentational: it takes plain data and depends on no app's engine.
    files: ['packages/music/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@wtnc/*'],
          message: '@frontpanel/music takes plain data; it must not depend on app packages.',
        }],
      }],
    },
  },
)
