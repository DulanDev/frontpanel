import type { Outputs } from './generate.ts'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import { generate } from './generate.ts'

const tailwindDir = dirname(createRequire(import.meta.url).resolve('tailwindcss/package.json'))

/**
 * Compiles `@import "tailwindcss"` plus the generated entry with Tailwind's own compiler: the
 * generated files are served from memory, Tailwind's from its package.
 */
async function build(outputs: Outputs, candidates: string[], entries = ['tailwind.css']): Promise<string> {
  const entry = ['tailwindcss', ...entries.map(file => `./${file}`)].map(id => `@import "${id}";\n`).join('')
  const compiler = await compile(entry, {
    base: '/fp',
    async loadStylesheet(id, base) {
      if (id === 'tailwindcss')
        return { path: join(tailwindDir, 'index.css'), base: tailwindDir, content: await readFile(join(tailwindDir, 'index.css'), 'utf8') }
      if (base === tailwindDir)
        return { path: join(tailwindDir, id), base, content: await readFile(join(tailwindDir, id), 'utf8') }
      const file = id.replace(/^\.\//, '') as keyof Outputs
      return { path: `/fp/${file}`, base: '/fp', content: outputs[file] }
    },
  })
  return compiler.build(candidates).replace(/\s+/g, ' ')
}

const outputs = generate({
  utilities: `
    @utility fp-module {
      border-radius: 10px;
      background-color: var(--fp-color-shell);
    }
  `,
  shared: '',
  tokens: { silver: { 'color-shell': '#bcc5d1' }, gunmetal: { 'color-shell': '#22262e' } },
  page: {
    utilities: `
      @utility fp-field {
        border: 1px solid var(--fp-color-shell);
      }
    `,
    shared: '',
  },
})

describe('tailwind.css compiled by Tailwind', () => {
  it('builds a variant of a Frontpanel class, as the app uses lg:module', async () => {
    const css = await build(outputs, ['lg:fp-module'])

    expect(css).toContain('@layer utilities { @media (width >= 64rem) { .lg\\:fp-module { border-radius: 10px; background-color: var(--fp-color-shell); } } }')
  })

  it('builds a theme utility that reads the token, so it follows the skin', async () => {
    const css = await build(outputs, ['bg-fp-shell'])

    expect(css).toContain('.bg-fp-shell { background-color: var(--fp-color-shell); }')
  })

  it('puts the tokens inside Tailwind\'s theme layer', async () => {
    const css = await build(outputs, [])

    expect(css).toContain('@layer theme, base, components, utilities;')
    expect(css).toContain('@layer theme { @layer frontpanel { :root, [data-fp-skin="silver"] { --fp-color-shell: #bcc5d1; }')
  })

  it('builds a page extra class beside the core entry, reading a core token', async () => {
    const css = await build(outputs, ['fp-field', 'lg:fp-field'], ['tailwind.css', 'tailwind-page.css'])

    expect(css).toContain('.fp-field { border: 1px solid var(--fp-color-shell); }')
    expect(css).toContain('@media (width >= 64rem) { .lg\\:fp-field {')
  })
})
