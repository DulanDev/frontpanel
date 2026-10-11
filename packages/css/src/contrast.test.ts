import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { contrastPairs } from './contrast-pairs.ts'

/** Each skin's colours as tokens.css ships them: silver in full, gunmetal as its overrides. */
function skins(): Record<'silver' | 'gunmetal', Map<string, string>> {
  const root = postcss.parse(readFileSync(new URL('../tokens.css', import.meta.url), 'utf8'))
  const read = (selector: string) => {
    const values = new Map<string, string>()
    root.walkRules(selector, rule => rule.walkDecls((decl) => {
      values.set(decl.prop, decl.value)
    }))
    return values
  }
  const silver = read(':root, [data-fp-skin="silver"]')
  return { silver, gunmetal: new Map([...silver, ...read('[data-fp-skin="gunmetal"]')]) }
}

/** WCAG 2 relative luminance of an opaque #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

const required = { text: 4.5, ui: 3 }

describe.each(Object.entries(skins()))('%s skin', (_skin, colours) => {
  it.each(contrastPairs)('$fg on $bg ($where) passes WCAG AA', ({ fg, bg, kind }) => {
    const [fore, back] = [fg, bg].map(name => colours.get(`--fp-color-${name}`))

    // Contrast is only defined for opaque colours; a translucent token cannot be a documented pair.
    expect(fore).toMatch(/^#[0-9a-f]{6}$/i)
    expect(back).toMatch(/^#[0-9a-f]{6}$/i)
    expect(contrast(fore!, back!)).toBeGreaterThanOrEqual(required[kind])
  })
})
