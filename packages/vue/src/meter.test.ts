import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FpMeter from './FpMeter.vue'

function meter(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(FpMeter, { props, attrs })
  return { wrapper, el: wrapper.get('[role="meter"]') }
}

function style(el: ReturnType<typeof meter>['el'], name: string): string {
  return (el.element as HTMLElement).style.getPropertyValue(name)
}

describe('fpMeter', () => {
  it('is a meter with its range and value', () => {
    const { el } = meter({ value: 30, min: 10, max: 60 })
    expect(el.classes()).toContain('fp-meter')
    expect(el.attributes('aria-valuemin')).toBe('10')
    expect(el.attributes('aria-valuemax')).toBe('60')
    expect(el.attributes('aria-valuenow')).toBe('30')
    expect(el.attributes('aria-valuetext')).toBeUndefined()
    expect(el.attributes('tabindex')).toBeUndefined()
  })

  it('stands up by default and lies on its side when horizontal', () => {
    expect(meter().el.attributes('data-orientation')).toBe('vertical')
    expect(meter({ orientation: 'horizontal' }).el.attributes('data-orientation')).toBe('horizontal')
  })

  it('lights the segments the value has reached, and no part of one', () => {
    const lit = (value: number) => style(meter({ value, segments: 10 }).el, '--fp-meter-level')
    expect(lit(0)).toBe('0')
    expect(lit(9.9)).toBe('0')
    expect(lit(10)).toBe('0.1')
    expect(lit(55)).toBe('0.5')
    expect(lit(100)).toBe('1')
  })

  it('lights all or nothing past the ends of its range', () => {
    expect(style(meter({ value: 140 }).el, '--fp-meter-level')).toBe('1')
    expect(style(meter({ value: -5 }).el, '--fp-meter-level')).toBe('0')
    expect(meter({ value: 140 }).el.attributes('aria-valuenow')).toBe('100')
  })

  it('turns amber at 70 percent and red at 90 by default, on segment edges', () => {
    const { el } = meter({ segments: 12 })
    expect(style(el, '--fp-meter-segments')).toBe('12')
    // 70 percent of 12 segments is 8.4, so amber starts on the ninth: 8/12 lit are green.
    expect(style(el, '--fp-meter-amber')).toBe(String(8 / 12))
    expect(style(el, '--fp-meter-red')).toBe(String(11 / 12))
  })

  it('takes its zones in the units of its value', () => {
    const { el } = meter({ min: -60, max: 0, segments: 6, amberAt: -20, redAt: -10 })
    expect(style(el, '--fp-meter-amber')).toBe(String(4 / 6))
    expect(style(el, '--fp-meter-red')).toBe(String(5 / 6))
  })

  it('takes its lens from around it unless given one', () => {
    expect(meter().el.classes()).toEqual(['fp-meter'])
    expect(meter({ lens: 'clear' }).el.classes()).toEqual(['fp-meter', 'fp-lens-clear'])
  })

  it('reads its value out as text when given a format', () => {
    const { el } = meter({ value: -6, min: -60, max: 6, valueText: (value: number) => `${value} dB` })
    expect(el.attributes('aria-valuetext')).toBe('-6 dB')
  })

  it('wears a silkscreen label under the meter that names it', () => {
    const { wrapper, el } = meter({ label: 'Left' })
    const label = wrapper.get('.fp-unit > .fp-silk')
    expect(label.text()).toBe('Left')
    expect(el.attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('puts class and style on the unit and every other attribute on the meter', () => {
    const { wrapper, el } = meter({}, { 'class': 'mx-2', 'style': 'margin: 1px;', 'aria-label': 'Input level', 'id': 'input' })
    expect(wrapper.classes()).toEqual(['fp-unit', 'mx-2'])
    expect(wrapper.attributes('style')).toBe('margin: 1px;')
    expect(el.attributes('aria-label')).toBe('Input level')
    expect(el.attributes('id')).toBe('input')
  })
})
