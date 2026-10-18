import { readFile } from 'node:fs/promises'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

const root = postcss.parse(await readFile(new URL('utilities.css', import.meta.url), 'utf8'))
let meter = ''
root.walkAtRules('utility', (rule) => {
  if (rule.params === 'fp-meter')
    meter = rule.toString()
})

// Every fallback a custom property gets in the rule, as numbers: `0.5` or `calc(8 / 12)`.
function fallbacks(name: string): number[] {
  return [...meter.matchAll(new RegExp(`var\\(--fp-meter-${name}, ([^()]+|calc\\([^()]+\\))\\)`, 'g'))].map(([, value]) => {
    const ratio = /calc\((\d+) \/ (\d+)\)/.exec(value!)
    return ratio ? Number(ratio[1]) / Number(ratio[2]) : Number(value)
  })
}

describe('fp-meter without set zones', () => {
  it('has one default each for segments, amber and red', () => {
    expect(new Set(fallbacks('segments')).size).toBe(1)
    expect(new Set(fallbacks('amber')).size).toBe(1)
    expect(new Set(fallbacks('red')).size).toBe(1)
  })

  // A zone edge inside a segment would light it half one colour and half the next.
  it.each(['amber', 'red'])('starts %s on a segment edge', (zone) => {
    const segments = fallbacks('segments')[0]!
    const edge = fallbacks(zone)[0]! * segments
    expect(edge).toBeCloseTo(Math.round(edge), 9)
  })
})
