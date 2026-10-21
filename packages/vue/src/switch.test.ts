import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FpSwitch from './FpSwitch.vue'

function control(wrapper: VueWrapper) {
  return wrapper.get('[role="switch"]')
}

// The last value the switch sent through v-model.
function sent(wrapper: VueWrapper): boolean | undefined {
  return (wrapper.emitted('update:modelValue') as boolean[][] | undefined)?.at(-1)?.[0]
}

describe('fpSwitch', () => {
  it('is a rocker on a switch button: off by default, a red lamp behind a face', () => {
    const wrapper = mount(FpSwitch)
    const button = control(wrapper)
    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('type')).toBe('button')
    expect(button.classes()).toEqual(['fp-switch', 'fp-led-red'])
    expect(button.attributes('aria-checked')).toBe('false')
    const rocker = button.get('.fp-switch-rocker')
    expect(rocker.findAll(':scope > span').map(part => part.classes()[0])).toEqual(['fp-switch-lamp', 'fp-switch-face'])
  })

  it('shows its state', () => {
    const wrapper = mount(FpSwitch, { props: { modelValue: true } })
    expect(control(wrapper).attributes('aria-checked')).toBe('true')
    expect(control(wrapper).attributes('data-state')).toBe('checked')
  })

  it('takes an LED colour for its lamp', () => {
    const wrapper = mount(FpSwitch, { props: { color: 'green' } })
    expect(control(wrapper).classes()).toEqual(['fp-switch', 'fp-led-green'])
  })

  it.each([
    ['a click', (wrapper: VueWrapper) => control(wrapper).trigger('click')],
    ['Enter', (wrapper: VueWrapper) => control(wrapper).trigger('keydown', { key: 'Enter' })],
  ])('turns on and off with %s', async (_name, press) => {
    const wrapper = mount(FpSwitch, {
      props: { 'modelValue': false, 'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }) },
    })
    await press(wrapper)
    expect(sent(wrapper)).toBe(true)
    expect(control(wrapper).attributes('aria-checked')).toBe('true')
    await press(wrapper)
    expect(sent(wrapper)).toBe(false)
  })

  it('does nothing while disabled', async () => {
    const wrapper = mount(FpSwitch, { props: { disabled: true } })
    expect(control(wrapper).attributes('disabled')).toBeDefined()
    await control(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('wears a silkscreen label under the switch that names it', () => {
    const wrapper = mount(FpSwitch, { props: { label: 'Power' } })
    const label = wrapper.get('.fp-unit > .fp-silk')
    expect(label.text()).toBe('Power')
    expect(control(wrapper).attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('puts class and style on the unit and every other attribute on the switch', () => {
    const wrapper = mount(FpSwitch, { attrs: { 'class': 'mx-2', 'style': 'margin: 1px;', 'aria-label': 'Power', 'aria-describedby': 'power-note', 'id': 'power' } })
    expect(wrapper.classes()).toEqual(['fp-unit', 'mx-2'])
    expect(wrapper.attributes('style')).toBe('margin: 1px;')
    expect(control(wrapper).attributes('aria-label')).toBe('Power')
    expect(control(wrapper).attributes('aria-describedby')).toBe('power-note')
    expect(control(wrapper).attributes('id')).toBe('power')
  })
})
