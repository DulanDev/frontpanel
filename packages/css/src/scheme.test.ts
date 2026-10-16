import type { AtRule } from 'postcss'
import { readFile } from 'node:fs/promises'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

async function utilities(file: string): Promise<Map<string, AtRule>> {
  const root = postcss.parse(await readFile(new URL(file, import.meta.url), 'utf8'))
  const found = new Map<string, AtRule>()
  root.walkAtRules('utility', utility => void found.set(utility.params, utility))
  return found
}

const all = new Map([...await utilities('utilities.css'), ...await utilities('page/utilities.css')])

// Native scrollbars and controls inside a device follow its skin, even on a page that leaves
// color-scheme alone or wears the other skin. The page root is left to base.css.
const surfaces = ['fp-device-backdrop', 'fp-device-rim', 'fp-device-body', 'fp-module', 'fp-well', 'fp-scroll-thin', 'fp-sheet-panel', 'fp-field']

describe('a surface in a skin', () => {
  it.each(surfaces)('%s takes the skin\'s color-scheme', (name) => {
    const scheme = all.get(name)?.nodes?.find(node => node.type === 'decl' && node.prop === 'color-scheme')

    expect(scheme?.toString()).toBe('color-scheme: var(--fp-scheme)')
  })
})
