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
    base: `
      :root {
        font-family: var(--fp-font-ui);
      }
    `,
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
    expect(css).toContain('@layer theme { @layer frontpanel { :root, [data-fp-skin="silver"] { --fp-scheme: light; --fp-color-shell: #bcc5d1; }')
  })

  it('builds a page extra class beside the core entry, reading a core token', async () => {
    const css = await build(outputs, ['fp-field', 'lg:fp-field'], ['tailwind.css', 'tailwind-page.css'])

    expect(css).toContain('.fp-field { border: 1px solid var(--fp-color-shell); }')
    expect(css).toContain('@media (width >= 64rem) { .lg\\:fp-field {')
  })

  it('puts the page defaults straight in Tailwind\'s base layer after preflight, so they win over its font, as the app imports them', async () => {
    const css = await build(outputs, [], ['tailwind.css', 'tailwind-page.css', 'tailwind-base.css'])
    const preflight = css.indexOf('html, :host {')
    const defaults = css.indexOf('@layer base { :root { font-family: var(--fp-font-ui); } }')

    expect(preflight).toBeGreaterThan(-1)
    expect(defaults).toBeGreaterThan(preflight)
  })

  it('lets a radius utility on a body in the rim beat the rim\'s own, as the app sizes its rim', async () => {
    const shipped = { 'tailwind.css': await readFile(new URL('../tailwind.css', import.meta.url), 'utf8'), 'tokens.css': await readFile(new URL('../tokens.css', import.meta.url), 'utf8') } as Outputs
    const css = await build(shipped, ['sm:fp-device-rim', 'fp-device-body', 'sm:rounded-[22px]'])
    const rimBody = /([^{}]+)\{ overflow: clip; border-radius: 26px; \}/.exec(css)?.[1]?.trim()

    expect(css).toContain('border-radius: 22px')
    // A body utility has one class's specificity, so the rim's rule for the body must have none.
    expect(rimBody).toBe(':where(.sm\\:fp-device-rim > .fp-device-body)')
  })
})
