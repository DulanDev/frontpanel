/*
 * The colour pairings Frontpanel relies on, checked against WCAG AA in both skins by
 * contrast.test.ts: 4.5:1 for text, 3:1 for non-text UI such as borders, rings and lit LEDs. A
 * custom skin that keeps these pairs passing keeps the classes readable. Names drop the
 * --fp-color- prefix.
 *
 * Not listed means not promised: `ink-dim` passes only on matte panels, so it never sits on the
 * bare shell.
 */
export interface ContrastPair {
  fg: string
  bg: string
  kind: 'text' | 'ui'
  /** Where the pairing appears. */
  where: string
}

export const contrastPairs: ContrastPair[] = [
  { fg: 'ink', bg: 'shell', kind: 'text', where: 'text on the device body' },
  { fg: 'ink', bg: 'shell-matte', kind: 'text', where: 'text in a module' },
  { fg: 'ink', bg: 'chrome-100', kind: 'text', where: 'chrome button label, light end' },
  { fg: 'ink', bg: 'chrome-300', kind: 'text', where: 'chrome button label, dark end' },
  { fg: 'ink', bg: 'well', kind: 'text', where: 'text in a recessed well' },
  { fg: 'ink', bg: 'field', kind: 'text', where: 'text in a field' },
  { fg: 'ink', bg: 'backdrop', kind: 'text', where: 'page text (base.css)' },
  { fg: 'ink-soft', bg: 'shell', kind: 'text', where: 'silkscreen label on the device body' },
  { fg: 'ink-soft', bg: 'shell-matte', kind: 'text', where: 'silkscreen label in a module' },
  { fg: 'ink-soft', bg: 'chrome-300', kind: 'text', where: 'silkscreen label on a title bar' },
  { fg: 'ink-soft', bg: 'well', kind: 'text', where: 'secondary text in a well' },
  { fg: 'ink-dim', bg: 'shell-matte', kind: 'text', where: 'dim text, matte panels only' },
  { fg: 'error-text', bg: 'shell-matte', kind: 'text', where: 'error message in a module' },
  { fg: 'error-text', bg: 'field', kind: 'text', where: 'error message in a field' },
  { fg: 'lcd-ink', bg: 'lcd-bg', kind: 'text', where: 'LCD readout' },
  { fg: 'housing-ink', bg: 'housing', kind: 'text', where: 'label in a dark housing' },
  { fg: 'gel-ink', bg: 'gel', kind: 'text', where: 'gel button label, mid-height' },
  { fg: 'cap-ink', bg: 'cap', kind: 'text', where: 'label on a plain cap' },
  { fg: 'cap-blue-ink', bg: 'cap-blue', kind: 'text', where: 'label on a blue cap' },
  { fg: 'cap-amber-ink', bg: 'cap-amber', kind: 'text', where: 'label on an amber cap' },
  { fg: 'cap-graphite-ink', bg: 'cap-graphite', kind: 'text', where: 'label on a graphite cap' },
  { fg: 'cap-berry-ink', bg: 'cap-berry', kind: 'text', where: 'label on a berry cap' },

  { fg: 'edge-strong', bg: 'shell-matte', kind: 'ui', where: 'field border in a module' },
  { fg: 'edge-strong', bg: 'field', kind: 'ui', where: 'field border against its fill' },
  { fg: 'select', bg: 'shell-matte', kind: 'ui', where: 'ring around a selected cap, against the module' },
  { fg: 'select', bg: 'well', kind: 'ui', where: 'ring around a selected cap, against a well' },
  { fg: 'focus-ring', bg: 'shell', kind: 'ui', where: 'focus ring on the device body' },
  { fg: 'focus-ring', bg: 'shell-matte', kind: 'ui', where: 'focus ring in a module' },
  { fg: 'focus-ring', bg: 'chrome-100', kind: 'ui', where: 'focus ring on chrome' },
  { fg: 'focus-ring', bg: 'backdrop', kind: 'ui', where: 'focus ring on the page' },
  { fg: 'led-on', bg: 'housing', kind: 'ui', where: 'lit green LED in its bezel' },
  { fg: 'led-amber', bg: 'housing', kind: 'ui', where: 'lit amber LED in its bezel' },
  { fg: 'led-red', bg: 'housing', kind: 'ui', where: 'lit red LED in its bezel' },
]
