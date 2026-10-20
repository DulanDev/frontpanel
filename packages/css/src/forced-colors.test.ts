import type { AtRule, Container } from 'postcss'
import { readFile } from 'node:fs/promises'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

const sources = await Promise.all(['utilities.css', 'page/utilities.css'].map(async file =>
  postcss.parse(await readFile(new URL(file, import.meta.url), 'utf8'))))
const utilities = new Map<string, AtRule>()
for (const root of sources)
  root.walkAtRules('utility', rule => void utilities.set(rule.params, rule))

const forced = '(forced-colors: active)'

function forcedBlocks(utility: AtRule): AtRule[] {
  const blocks: AtRule[] = []
  utility.walkAtRules('media', (rule) => {
    if (rule.params === forced)
      blocks.push(rule)
  })
  return blocks
}

/*
 * Forced colours drop gradients and shadows and repaint backgrounds in the page colour, which is
 * how most parts are drawn. Each class either answers for itself in a forced-colors block, or is
 * here with the reason it needs none. A new class has to pick one.
 */
const fineAsIs: Record<string, string> = {
  'fp-lcd-redraw': 'motion only',
  'fp-blink-twice': 'motion only',
  'fp-device-backdrop': 'the page behind the device: the page colour is right',
  'fp-device-body': 'the rim around it draws the edge, or it is the whole page',
  'fp-chrome': 'a surface finish; the part it finishes draws the edge',
  'fp-chrome-soft': 'a surface finish; the part it finishes draws the edge',
  'fp-cap-blue': 'sets the colour only; fp-cap draws the shape',
  'fp-cap-amber': 'sets the colour only; fp-cap draws the shape',
  'fp-cap-graphite': 'sets the colour only; fp-cap draws the shape',
  'fp-cap-berry': 'sets the colour only; fp-cap draws the shape',
  'fp-unit': 'layout',
  'fp-fader': 'layout; its slot and cap draw it',
  'fp-readout': 'its border is kept, in the system colour',
  'fp-readout-text': 'text for screen readers, never shown',
  'fp-module-title': 'its bottom border is kept, in the system colour',
  'fp-window': 'layout',
  'fp-window-title': 'text',
  'fp-window-body': 'layout',
  'fp-silk': 'text',
  'fp-lcd-line': 'text',
  'fp-led-green': 'sets the colour only; fp-led and fp-led-lit draw it',
  'fp-led-amber': 'sets the colour only; fp-led and fp-led-lit draw it',
  'fp-led-red': 'sets the colour only; fp-led and fp-led-lit draw it',
  'fp-lens-flat': 'lens settings only',
  'fp-lens-diffused': 'lens settings only',
  'fp-lens-clear': 'lens settings only',
  'fp-screw': 'decorative and hidden from assistive technology',
  'fp-scroll-thin': 'the system scrollbar takes over',
  'fp-icon': 'its fill follows the forced text colour',
  'fp-field': 'its border is kept, in the system colour',
}

const systemColors = new Set(['Canvas', 'CanvasText', 'LinkText', 'VisitedText', 'ActiveText', 'ButtonFace', 'ButtonText', 'ButtonBorder', 'Field', 'FieldText', 'Highlight', 'HighlightText', 'SelectedItem', 'SelectedItemText', 'Mark', 'MarkText', 'GrayText', 'AccentColor', 'AccentColorText'])
const paint = /^(?:color|background(?:-color|-image)?|outline(?:-color)?|border(?:-.+)?|box-shadow|fill|stroke)$/

// Every colour a part paints with once it opts out of forced colours.
function optedOutPaint(block: AtRule): string[] {
  const values: string[] = []
  const visit = (container: Container, optedOut: boolean) => {
    const out = optedOut || container.some(node => node.type === 'decl' && node.prop === 'forced-color-adjust' && node.value === 'none')
    container.each((node) => {
      if (node.type === 'decl' && out && paint.test(node.prop))
        values.push(node.value)
      else if (node.type === 'rule' || node.type === 'atrule')
        visit(node, out)
    })
  }
  visit(block, false)
  return values
}

describe('forced colours', () => {
  it('knows every class', () => {
    const stale = Object.keys(fineAsIs).filter(name => !utilities.has(name))
    expect(stale).toEqual([])
  })

  it.each([...utilities.keys()])('%s shows with forced colours', (name) => {
    const blocks = forcedBlocks(utilities.get(name)!)
    if (name in fineAsIs)
      expect(blocks, `${name} is listed as fine as is: take it off the list`).toEqual([])
    else
      expect(blocks.length, `${name} needs a forced-colors block, or a reason in fineAsIs`).toBeGreaterThan(0)
  })

  // A part that opts out keeps its author colours, so it must choose the system's own.
  it.each([...utilities.keys()].filter(name => forcedBlocks(utilities.get(name)!).length > 0))('%s paints only in system colours where it opts out', (name) => {
    const values = forcedBlocks(utilities.get(name)!).flatMap(optedOutPaint)
    const words = values.flatMap(value => value.split(/\s+/)).filter(word => /^[a-z]/i.test(word))
    const colors = words.filter(word => !['none', 'solid'].includes(word))
    expect(colors.filter(word => !systemColors.has(word))).toEqual([])
    expect(values.join(' ')).not.toMatch(/var\(|#|rgb|hsl|color-mix/)
  })
})
