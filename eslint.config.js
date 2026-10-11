import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
    ignores: [
      '**/dist/**',
      '**/coverage/**',
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
