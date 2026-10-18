import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import FpKnob from './FpKnob.vue'

function knob(wrapper: VueWrapper) {
  return wrapper.get('[role="slider"]')
}

// The last value the knob sent through v-model.
function sent(wrapper: VueWrapper): number | undefined {
  return (wrapper.emitted('update:modelValue') as number[][] | undefined)?.at(-1)?.[0]
}

describe('fpKnob', () => {
  it('is a slider with its range and value', () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 30, min: 10, max: 60 } })
    const slider = knob(wrapper)
    expect(slider.classes()).toContain('fp-knob')
    expect(slider.attributes('tabindex')).toBe('0')
    expect(slider.attributes('aria-valuemin')).toBe('10')
    expect(slider.attributes('aria-valuemax')).toBe('60')
    expect(slider.attributes('aria-valuenow')).toBe('30')
    expect(slider.attributes('aria-valuetext')).toBeUndefined()
  })

  it('turns its mark through 270 degrees, from -135 at the minimum to 135 at the maximum', () => {
    const angle = (modelValue: number) =>
      mount(FpKnob, { props: { modelValue } }).get('.fp-knob-mark').attributes('style')
    expect(angle(0)).toBe('rotate: -135deg;')
    expect(angle(50)).toBe('rotate: 0deg;')
    expect(angle(100)).toBe('rotate: 135deg;')
  })

  it('reads its value out as text when given a format', () => {
    const wrapper = mount(FpKnob, { props: { modelValue: -6, min: -60, max: 6, valueText: (value: number) => `${value} dB` } })
    expect(knob(wrapper).attributes('aria-valuetext')).toBe('-6 dB')
  })

  it('wears a silkscreen label under the knob that names it', () => {
    const wrapper = mount(FpKnob, { props: { label: 'Volume' } })
    const label = wrapper.get('.fp-unit > .fp-silk')
    expect(label.text()).toBe('Volume')
    expect(knob(wrapper).attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('puts class and style on the unit and every other attribute on the knob', () => {
    const wrapper = mount(FpKnob, { attrs: { 'class': 'mx-2', 'style': 'margin: 1px;', 'aria-label': 'Gain', 'id': 'gain' } })
    expect(wrapper.classes()).toEqual(['fp-unit', 'mx-2'])
    expect(wrapper.attributes('style')).toBe('margin: 1px;')
    expect(knob(wrapper).attributes('aria-label')).toBe('Gain')
    expect(knob(wrapper).attributes('id')).toBe('gain')
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
  ])('moves with %s', async (key, expected) => {
    const wrapper = mount(FpKnob, { props: { modelValue: 50 } })
    await knob(wrapper).trigger('keydown', { key })
    expect(sent(wrapper)).toBe(expected)
    expect(wrapper.emitted('valueCommit')?.at(-1)).toEqual([expected])
  })

  it('stops at the ends of its range', async () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 95 } })
    await knob(wrapper).trigger('keydown', { key: 'PageUp' })
    expect(sent(wrapper)).toBe(100)
  })

  it('snaps to its step without floating-point noise', async () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 0.2, min: 0, max: 1, step: 0.1 } })
    await knob(wrapper).trigger('keydown', { key: 'ArrowUp' })
    expect(sent(wrapper)).toBe(0.3)
  })

  it('sends nothing for a key that does not move it, or at an end it is already at', async () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 100 } })
    await knob(wrapper).trigger('keydown', { key: 'Enter' })
    await knob(wrapper).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
  })

  it('works with v-model', async () => {
    const volume = ref(20)
    const wrapper = mount(() => h(FpKnob, {
      'modelValue': volume.value,
      'onUpdate:modelValue': (value: number) => {
        volume.value = value
      },
    }))
    await knob(wrapper).trigger('keydown', { key: 'ArrowUp' })
    expect(volume.value).toBe(21)
    expect(knob(wrapper).attributes('aria-valuenow')).toBe('21')
  })

  it('turns up as the pointer drags up, 200 px for the whole range, and commits on release', async () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 50 } })
    const slider = knob(wrapper)
    await slider.trigger('pointerdown', { button: 0, pointerId: 1, clientY: 300 })
    await slider.trigger('pointermove', { pointerId: 1, clientY: 280 })
    expect(sent(wrapper)).toBe(60)
    await slider.trigger('pointermove', { pointerId: 1, clientY: 340 })
    expect(sent(wrapper)).toBe(30)
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
    await slider.trigger('pointerup', { pointerId: 1, clientY: 340 })
    expect(wrapper.emitted('valueCommit')).toEqual([[30]])
  })

  it('takes focus when pressed, without lighting its focus ring', async () => {
    const focus = vi.spyOn(HTMLElement.prototype, 'focus')
    const wrapper = mount(FpKnob, { props: { modelValue: 50 } })
    await knob(wrapper).trigger('pointerdown', { button: 0, pointerId: 1, clientY: 300 })
    expect(focus).toHaveBeenCalledWith({ preventScroll: true, focusVisible: false })
    focus.mockRestore()
  })

  it('moves a tenth as far while Shift is held', async () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 50 } })
    const slider = knob(wrapper)
    await slider.trigger('pointerdown', { button: 0, pointerId: 1, clientY: 300 })
    await slider.trigger('pointermove', { pointerId: 1, clientY: 260, shiftKey: true })
    expect(sent(wrapper)).toBe(52)
  })

  it('ignores a drag after release, and other mouse buttons', async () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 50 } })
    const slider = knob(wrapper)
    await slider.trigger('pointerdown', { button: 2, pointerId: 1, clientY: 300 })
    await slider.trigger('pointermove', { pointerId: 1, clientY: 200 })
    await slider.trigger('pointerdown', { button: 0, pointerId: 1, clientY: 300 })
    await slider.trigger('pointerup', { pointerId: 1, clientY: 300 })
    await slider.trigger('pointermove', { pointerId: 1, clientY: 200 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
  })

  it('does nothing when disabled, and leaves the tab order', async () => {
    const wrapper = mount(FpKnob, { props: { modelValue: 50, disabled: true } })
    const slider = knob(wrapper)
    expect(slider.attributes('aria-disabled')).toBe('true')
    expect(slider.attributes('tabindex')).toBeUndefined()
    await slider.trigger('keydown', { key: 'ArrowUp' })
    await slider.trigger('pointerdown', { button: 0, pointerId: 1, clientY: 300 })
    await slider.trigger('pointermove', { pointerId: 1, clientY: 200 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
