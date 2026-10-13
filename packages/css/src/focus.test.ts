import type { AtRule, Rule } from 'postcss'
import { readFile } from 'node:fs/promises'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

const source = postcss.parse(await readFile(new URL('utilities.css', import.meta.url), 'utf8'))

function filterRules(utility: AtRule, state: string): Rule[] {
  const rules: Rule[] = []
  utility.walkRules((rule) => {
    if (rule.selectors.some(selector => selector.includes(state)) && rule.some(node => node.type === 'decl' && node.prop === 'filter'))
      rules.push(rule)
  })
  return rules
}

// A control with a hover filter and a focus glow: `&:hover:not(:disabled)` outranks
// `&:focus-visible`, so without a rule for both, a hovered control loses its keyboard glow.
const controls = source.nodes.filter((node): node is AtRule =>
  node.type === 'atrule' && filterRules(node, ':hover').length > 0 && filterRules(node, ':focus-visible').length > 0)

describe('a focused control under the pointer', () => {
  it('finds the controls to check', () => {
    expect(controls.map(utility => utility.params)).toEqual(expect.arrayContaining(['fp-chrome-btn', 'fp-gel', 'fp-cap']))
  })

  it.each(controls.map(utility => [utility.params, utility] as const))('%s keeps its focus glow while hovered', (_name, utility) => {
    const both = filterRules(utility, ':focus-visible').filter(rule => rule.selectors.some(selector => selector.includes(':hover')))
    const filter = both.flatMap(rule => rule.nodes).find(node => node.type === 'decl' && node.prop === 'filter')

    expect(filter?.toString()).toMatch(/brightness\(.*\) drop-shadow\(/)
  })
})
