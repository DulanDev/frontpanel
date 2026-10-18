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

// A meter's or readout's unlit segment is the LED's off colour with a share of the lit colour mixed
// in, so the shapes show before they light. A lit segment still has to stand 3:1 against an unlit
// neighbour; against the housing it is the LED pairs above.
const utilities = postcss.parse(readFileSync(new URL('utilities.css', import.meta.url), 'utf8'))
const offShares = new Map<string, number>()
utilities.walkAtRules('utility', (rule) => {
  const share = /color-mix\(in srgb, var\(--fp-color-led-off\) (\d+)%, (?!black)/.exec(rule.toString())?.[1]
  if (share)
    offShares.set(rule.params, Number(share) / 100)
})

function mix(over: string, under: string, share: number): string {
  const channels = (hex: string) => [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16))
  const [a, b] = [channels(over), channels(under)]
  return `#${a.map((value, i) => Math.round(value * share + b[i]! * (1 - share)).toString(16).padStart(2, '0')).join('')}`
}

describe.each(Object.entries(skins()))('%s unlit segments', (_skin, colours) => {
  it('are drawn by the meter and the readout', () => {
    expect([...offShares.keys()]).toEqual(['fp-meter', 'fp-readout-cell'])
  })

  it.each([...offShares].flatMap(([utility, share]) => ['led-on', 'led-amber', 'led-red'].map(led => [utility, led, share] as const)))('%s: a lit %s segment stands out from an unlit one', (_utility, led, share) => {
    const lit = colours.get(`--fp-color-${led}`)!
    const unlit = mix(colours.get('--fp-color-led-off')!, lit, share)
    expect(contrast(lit, unlit)).toBeGreaterThanOrEqual(required.ui)
  })
})

// The readout's digits sit on a near-black face, the off colour darkened. They are text, so a lit
// segment needs 4.5:1 against it at any size.
let faceShare: number | undefined
utilities.walkAtRules('utility', (rule) => {
  if (rule.params === 'fp-readout')
    faceShare = Number(/color-mix\(in srgb, var\(--fp-color-led-off\) (\d+)%, black\)/.exec(rule.toString())?.[1]) / 100
})

describe.each(Object.entries(skins()))('%s readout face', (_skin, colours) => {
  it.each(['led-on', 'led-amber', 'led-red'])('a lit %s segment reads as text on it', (led) => {
    expect(faceShare).toBeGreaterThan(0)
    const face = mix(colours.get('--fp-color-led-off')!, '#000000', faceShare!)
    expect(contrast(colours.get(`--fp-color-${led}`)!, face)).toBeGreaterThanOrEqual(required.text)
  })
})
