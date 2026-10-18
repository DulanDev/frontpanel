// @vitest-environment node
/*
 * Tailwind generates only the classes its scanner finds written out in the files it scans, so a
 * class built from a template (`fp-led-${color}`) never reaches an app that uses Tailwind. This
 * scans the built dist/, as an app's `@source` line does: run `pnpm build` first.
 */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Scanner } from '@tailwindcss/oxide'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const tailwindDir = dirname(require.resolve('tailwindcss/package.json'))
const cssDir = dirname(require.resolve('@frontpanel/css/tailwind.css'))
const dist = fileURLToPath(new URL('../dist', import.meta.url))

async function load(path: string) {
  return { path, base: dirname(path), content: await readFile(path, 'utf8') }
}

/** The app's stack: Tailwind, the Frontpanel entry, and `@source` on this package's dist/. */
async function appCss(): Promise<string> {
  const compiler = await compile('@import "tailwindcss";\n@import "@frontpanel/css/tailwind.css";\n', {
    base: dist,
    async loadStylesheet(id, base) {
      if (id === 'tailwindcss')
        return load(join(tailwindDir, 'index.css'))
      if (id.startsWith('@frontpanel/css/'))
        return load(join(cssDir, id.slice('@frontpanel/css/'.length)))
      return load(join(base, id))
    },
  })
  const candidates = new Scanner({ sources: [{ base: dist, pattern: '**/*', negated: false }] }).scan()
  return compiler.build(candidates)
}

describe('the classes the components wear, scanned from dist/ by Tailwind', () => {
  it.each([
    'fp-led-green',
    'fp-led-amber',
    'fp-led-red',
    'fp-cap-blue',
    'fp-cap-amber',
    'fp-cap-graphite',
    'fp-cap-berry',
    'fp-lens-flat',
    'fp-lens-diffused',
    'fp-lens-clear',
  ])('generates .%s', async (name) => {
    expect(existsSync(join(dist, 'index.js')), 'dist/ is missing: run pnpm build').toBe(true)

    expect(await appCss()).toContain(`.${name} {`)
  })
})
