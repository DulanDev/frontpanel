import type { AtRule } from 'postcss'
import { readFile } from 'node:fs/promises'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

const root = postcss.parse(await readFile(new URL('utilities.css', import.meta.url), 'utf8'))
const utilities = new Map<string, AtRule>()
root.walkAtRules('utility', rule => void utilities.set(rule.params, rule))

function sets(name: string): Record<string, string> {
  const values: Record<string, string> = {}
  utilities.get(name)?.each((node) => {
    if (node.type === 'decl')
      values[node.prop] = node.value
  })
  return values
}

// Every fallback a lens property gets where a part reads it.
function fallbacks(property: string): string[] {
  return [...root.toString().matchAll(new RegExp(`var\\(${property}, ([^)]+)\\)`, 'g'))].map(([, value]) => value!)
}

describe('led lenses', () => {
  it.each(['fp-lens-flat', 'fp-lens-diffused', 'fp-lens-clear'])('%s sets both the hot spot and the glow', (name) => {
    expect(Object.keys(sets(name)).sort()).toEqual(['--fp-led-core', '--fp-led-glow'])
  })

  it('runs from no hot spot to a strong one', () => {
    const core = ['fp-lens-flat', 'fp-lens-diffused', 'fp-lens-clear'].map(name => Number(sets(name)['--fp-led-core']))
    expect(core[0]).toBe(0)
    expect(core).toEqual([...core].sort((a, b) => a - b))
  })

  // With no lens class anywhere, a part looks as fp-lens-diffused does.
  it.each(['--fp-led-core', '--fp-led-glow'])('defaults %s to the diffused lens', (property) => {
    const read = fallbacks(property)
    expect(read.length).toBeGreaterThan(0)
    expect(new Set(read)).toEqual(new Set([sets('fp-lens-diffused')[property]]))
  })

  // A flat lens keeps the glow, so a flat fp-led is the LED as 0.1.0 shipped it.
  it('keeps the glow on a flat lens', () => {
    expect(sets('fp-lens-flat')['--fp-led-glow']).toBe(sets('fp-lens-diffused')['--fp-led-glow'])
  })
})
