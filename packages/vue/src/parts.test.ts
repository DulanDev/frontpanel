import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FpHousing from './FpHousing.vue'
import FpLed from './FpLed.vue'
import FpScrew from './FpScrew.vue'
import FpSilk from './FpSilk.vue'
import FpWell from './FpWell.vue'

describe('fpLed', () => {
  it('is an unlit green LED, hidden from assistive tech', () => {
    const led = mount(FpLed).get('span')
    expect(led.classes()).toEqual(['fp-led', 'fp-led-green'])
    expect(led.attributes('aria-hidden')).toBe('true')
    expect(led.attributes('role')).toBeUndefined()
  })

  it.each(['green', 'amber', 'red'] as const)('lights %s', (color) => {
    const led = mount(FpLed, { props: { color, lit: true } }).get('span')
    expect(led.classes()).toEqual(['fp-led', `fp-led-${color}`, 'fp-led-lit'])
  })

  it('takes its lens from around it unless given one', () => {
    expect(mount(FpLed, { props: { lit: true } }).classes().filter(name => name.startsWith('fp-lens'))).toEqual([])
    expect(mount(FpLed, { props: { lit: true, lens: 'clear' } }).classes()).toContain('fp-lens-clear')
    expect(mount(FpLed, { props: { lit: true, lens: 'flat' } }).classes()).toContain('fp-lens-flat')
  })

  it('blinks twice only while lit', () => {
    expect(mount(FpLed, { props: { lit: true, blink: true } }).classes()).toContain('fp-blink-twice')
    expect(mount(FpLed, { props: { blink: true } }).classes()).not.toContain('fp-blink-twice')
  })

  it('is announced when it carries a label', () => {
    const led = mount(FpLed, { props: { lit: true, label: 'Recording' } }).get('span')
    expect(led.attributes('role')).toBe('img')
    expect(led.attributes('aria-label')).toBe('Recording')
    expect(led.attributes('aria-hidden')).toBeUndefined()
  })
})

describe('fpHousing', () => {
  it('is a span holding its content', () => {
    const wrapper = mount(FpHousing, { slots: { default: 'PWR' } })
    expect(wrapper.html()).toBe('<span class="fp-housing">PWR</span>')
  })

  it('renders as another element', () => {
    expect(mount(FpHousing, { props: { as: 'div' } }).element.tagName).toBe('DIV')
  })
})

describe('fpWell', () => {
  it('is a div holding its content', () => {
    expect(mount(FpWell, { slots: { default: 'Empty' } }).html()).toBe('<div class="fp-well">Empty</div>')
  })

  it('renders as another element', () => {
    expect(mount(FpWell, { props: { as: 'ul' } }).element.tagName).toBe('UL')
  })
})

describe('fpSilk', () => {
  it('is a silkscreened span', () => {
    expect(mount(FpSilk, { slots: { default: 'Volume' } }).html()).toBe('<span class="fp-silk">Volume</span>')
  })

  it('renders as a heading or label', () => {
    expect(mount(FpSilk, { props: { as: 'h2' } }).element.tagName).toBe('H2')
  })
})

describe('fpScrew', () => {
  it('is decorative', () => {
    expect(mount(FpScrew).html()).toBe('<span class="fp-screw" aria-hidden="true"></span>')
  })
})
