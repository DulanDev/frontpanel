import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { contrastPairs } from './contrast-pairs.ts'
import { contrast, isOpaqueHex, required } from './contrast.ts'

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

describe.each(Object.entries(skins()))('%s skin', (_skin, colours) => {
  it.each(contrastPairs)('$fg on $bg ($where) passes WCAG AA', ({ fg, bg, kind }) => {
    const [fore, back] = [fg, bg].map(name => colours.get(`--fp-color-${name}`))

    // Contrast is only defined for opaque colours; a translucent token cannot be a documented pair.
    expect(isOpaqueHex(fore ?? ''), `${fg} is ${fore}`).toBe(true)
    expect(isOpaqueHex(back ?? ''), `${bg} is ${back}`).toBe(true)
    expect(contrast(fore!, back!)).toBeGreaterThanOrEqual(required[kind])
  })
})
