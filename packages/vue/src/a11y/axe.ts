import type { Result } from 'axe-core'
import axe from 'axe-core'

export type Skin = 'silver' | 'gunmetal'

/** WCAG 2.0 to 2.2, levels A and AA. Best-practice rules (landmarks, headings) stay out: components are mounted alone. */
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

export interface ScanOptions {
  /**
   * Rules to skip for this one scan, only where Reka UI owns the markup. Each needs the reason and
   * a link to the upstream issue, and is printed with the result so exceptions stay visible.
   */
  disabledRules?: { id: string, reason: string }[]
  /** Names the case in the printed output. */
  label?: string
}

function describeViolation(violation: Result): string {
  const targets = violation.nodes.map(node => `    ${node.target.join(' ')}`).join('\n')
  return `${violation.id} (${violation.impact}): ${violation.help}\n${targets}\n    ${violation.helpUrl}`
}

/**
 * Runs axe over the whole document, so content a component renders elsewhere (an open menu) is
 * included. Any violation rejects. Results axe can't decide, such as text over a gradient, and any
 * disabled rules are printed and do not fail.
 */
export async function scan(skin: Skin, { disabledRules = [], label = '' }: ScanOptions = {}): Promise<void> {
  document.documentElement.dataset.fpSkin = skin
  const results = await axe.run(document, {
    runOnly: { type: 'tag', values: wcagTags },
    rules: Object.fromEntries(disabledRules.map(rule => [rule.id, { enabled: false }])),
  })

  const name = `[axe ${skin}${label ? ` · ${label}` : ''}]`
  for (const rule of disabledRules)
    console.warn(`${name} rule off: ${rule.id}: ${rule.reason}`)
  for (const item of results.incomplete)
    console.warn(`${name} needs review: ${item.id}: ${item.help} (${item.nodes.length} element${item.nodes.length === 1 ? '' : 's'})`)

  if (results.violations.length > 0)
    throw new Error(`${name} ${results.violations.length} accessibility violation(s):\n${results.violations.map(describeViolation).join('\n')}`)
}
