import type { VueWrapper } from '@vue/test-utils'
import type { FpReadoutProps } from './FpReadout.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FpReadout from './FpReadout.vue'

// Each cell as the segments it lights: 'abcdefg' plus '.' for the decimal point, or ':' for a colon.
function cells(wrapper: VueWrapper): string[] {
  return wrapper.findAll('.fp-readout-cell').map((cell) => {
    if (cell.attributes('data-colon') !== undefined)
      return ':'
    return cell.findAll('[data-lit]').map(segment => segment.attributes('data-segment') === 'dp' ? '.' : segment.attributes('data-segment')).join('')
  })
}

function readout(props: FpReadoutProps) {
  return mount(FpReadout, { props })
}

describe('fpReadout', () => {
  it('draws a seven-segment cell for each character, in a green LED housing', () => {
    const wrapper = readout({ value: '80' })
    expect(wrapper.classes()).toEqual(['fp-readout', 'fp-led-green'])
    expect(cells(wrapper)).toEqual(['abcdefg', 'abcdef'])
  })

  it.each([
    ['0', 'abcdef'],
    ['1', 'bc'],
    ['2', 'abdeg'],
    ['3', 'abcdg'],
    ['4', 'bcfg'],
    ['5', 'acdfg'],
    ['6', 'acdefg'],
    ['7', 'abc'],
    ['8', 'abcdefg'],
    ['9', 'abcdfg'],
    ['-', 'g'],
    [' ', ''],
  ])('lights %j as %s', (character, segments) => {
    expect(cells(readout({ value: character }))).toEqual([segments])
  })

  it('spells the letters a seven-segment display can', () => {
    expect(cells(readout({ value: 'Err' }))).toEqual(['adefg', 'eg', 'eg'])
    expect(cells(readout({ value: 'HOLD' }))).toEqual(['bcefg', 'abcdef', 'def', 'bcdeg'])
  })

  it('leaves a character it cannot draw dark', () => {
    expect(cells(readout({ value: 'X1' }))).toEqual(['', 'bc'])
  })

  it('lights a decimal point on the digit before it', () => {
    expect(cells(readout({ value: 3.14 }))).toEqual(['abcdg.', 'bc', 'bcfg'])
    expect(cells(readout({ value: '.5' }))).toEqual(['.', 'acdfg'])
  })

  it('draws a colon as a cell of its own', () => {
    expect(cells(readout({ value: '12:05' }))).toEqual(['bc', 'abdeg', ':', 'abcdef', 'acdfg'])
  })

  it('pads to its digits on the left with dark cells, leaving colons out of the count', () => {
    expect(cells(readout({ value: -6, digits: 4 }))).toEqual(['', '', 'g', 'acdefg'])
    expect(cells(readout({ value: '9:41', digits: 4 }))).toEqual(['', 'abcdfg', ':', 'bcfg', 'bc'])
  })

  it('shows every character of a value longer than its digits', () => {
    expect(cells(readout({ value: 12345, digits: 3 }))).toHaveLength(5)
  })

  it.each(['amber', 'red'] as const)('lights in %s', (color) => {
    expect(readout({ value: 1, color }).classes()).toEqual(['fp-readout', `fp-led-${color}`])
  })

  it('reads out its value as text, and hides the drawing', () => {
    const wrapper = readout({ value: '12:05' })
    expect(wrapper.get('.fp-readout-text').text()).toBe('12:05')
    for (const cell of wrapper.findAll('.fp-readout-cell'))
      expect(cell.attributes('aria-hidden')).toBe('true')
  })

  it('reads out the words it is given instead', () => {
    const wrapper = readout({ value: -6, valueText: (value: string) => `${value} dB` })
    expect(wrapper.get('.fp-readout-text').text()).toBe('-6 dB')
  })
})
