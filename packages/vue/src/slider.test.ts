import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import FpSlider from './FpSlider.vue'

function cap(wrapper: VueWrapper) {
  return wrapper.get('[role="slider"]')
}

// The last value the fader sent through v-model.
function sent(wrapper: VueWrapper): number | undefined {
  return (wrapper.emitted('update:modelValue') as number[][] | undefined)?.at(-1)?.[0]
}

describe('fpSlider', () => {
  it('is a vertical fader: a cap in a slot, with its range and value', async () => {
    const wrapper = mount(FpSlider, { props: { modelValue: 30, min: 10, max: 60 } })
    // Reka finds the cap's place among the thumbs after mounting, and its value with it.
    await nextTick()
    const fader = wrapper.get('.fp-fader')
    expect(fader.attributes('data-orientation')).toBe('vertical')
    expect(fader.find('.fp-fader-slot').exists()).toBe(true)
    const slider = cap(wrapper)
    expect(slider.classes()).toContain('fp-fader-cap')
    expect(slider.attributes('tabindex')).toBe('0')
    expect(slider.attributes('aria-orientation')).toBe('vertical')
    expect(slider.attributes('aria-valuemin')).toBe('10')
    expect(slider.attributes('aria-valuemax')).toBe('60')
    expect(slider.attributes('aria-valuenow')).toBe('30')
    expect(slider.attributes('aria-valuetext')).toBeUndefined()
  })

  it('lies on its side when horizontal', () => {
    const wrapper = mount(FpSlider, { props: { orientation: 'horizontal' } })
    expect(wrapper.get('.fp-fader').attributes('data-orientation')).toBe('horizontal')
    expect(cap(wrapper).attributes('aria-orientation')).toBe('horizontal')
  })

  it('reads its value out as text when given a format', () => {
    const wrapper = mount(FpSlider, { props: { modelValue: -6, min: -60, max: 6, valueText: (value: number) => `${value} dB` } })
    expect(cap(wrapper).attributes('aria-valuetext')).toBe('-6 dB')
  })

  it('wears a silkscreen label under the fader that names it', () => {
    const wrapper = mount(FpSlider, { props: { label: 'Bass' } })
    const label = wrapper.get('.fp-unit > .fp-silk')
    expect(label.text()).toBe('Bass')
    expect(cap(wrapper).attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('puts class and style on the unit and every other attribute on the cap', () => {
    const wrapper = mount(FpSlider, { attrs: { 'class': 'mx-2', 'style': 'margin: 1px;', 'aria-label': 'Gain', 'id': 'gain' } })
    expect(wrapper.classes()).toEqual(['fp-unit', 'mx-2'])
    expect(wrapper.attributes('style')).toBe('margin: 1px;')
    expect(cap(wrapper).attributes('aria-label')).toBe('Gain')
    expect(cap(wrapper).attributes('id')).toBe('gain')
  })

  it.each([
    ['ArrowUp', 51],
    ['ArrowRight', 51],
    ['ArrowDown', 49],
    ['ArrowLeft', 49],
    ['PageUp', 60],
    ['PageDown', 40],
    ['Home', 0],
    ['End', 100],
  ])('moves with %s, sending a number rather than a list', async (key, expected) => {
    const wrapper = mount(FpSlider, { props: { modelValue: 50 } })
    await cap(wrapper).trigger('keydown', { key })
    expect(sent(wrapper)).toBe(expected)
    expect(wrapper.emitted('valueCommit')?.at(-1)).toEqual([expected])
  })

  it('snaps to its step without floating-point noise', async () => {
    const wrapper = mount(FpSlider, { props: { modelValue: 0.2, min: 0, max: 1, step: 0.1 } })
    await cap(wrapper).trigger('keydown', { key: 'ArrowUp' })
    expect(sent(wrapper)).toBe(0.3)
  })

  it('takes focus when pressed, without lighting its focus ring', async () => {
    const focus = vi.spyOn(HTMLElement.prototype, 'focus')
    const wrapper = mount(FpSlider, { props: { modelValue: 50 }, attachTo: document.body })
    await nextTick()
    await wrapper.get('.fp-fader-slot').trigger('pointerdown', { button: 0, pointerId: 1 })
    expect(focus.mock.contexts[0]).toBe(cap(wrapper).element)
    expect(focus.mock.calls[0]).toEqual([{ preventScroll: true, focusVisible: false }])
    focus.mockRestore()
    wrapper.unmount()
  })

  it('works with v-model', async () => {
    const level = ref(20)
    const wrapper = mount(() => h(FpSlider, {
      'modelValue': level.value,
      'onUpdate:modelValue': (value: number) => {
        level.value = value
      },
    }))
    await cap(wrapper).trigger('keydown', { key: 'ArrowUp' })
    expect(level.value).toBe(21)
    expect(cap(wrapper).attributes('aria-valuenow')).toBe('21')
  })

  it('does nothing when disabled, and leaves the tab order', async () => {
    const wrapper = mount(FpSlider, { props: { modelValue: 50, disabled: true } })
    const slider = cap(wrapper)
    expect(slider.attributes('aria-disabled')).toBe('true')
    expect(slider.attributes('tabindex')).toBeUndefined()
    expect(wrapper.get('.fp-fader').attributes('data-disabled')).toBe('')
    await slider.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
