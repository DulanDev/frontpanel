import type { VueWrapper } from '@vue/test-utils'
import type { FpKeyOption } from './keys'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import FpCheckbox from './FpCheckbox.vue'
import FpCheckboxGroup from './FpCheckboxGroup.vue'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

// The text of the element an attribute points at by id.
function textOf(wrapper: VueWrapper, id: string | undefined) {
  return id ? wrapper.find(`[id="${id}"]`).text() : undefined
}

describe('fpCheckbox', () => {
  function pause(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
    const wrapper = mount(FpCheckbox, {
      props: {
        'label': 'Pause',
        'modelValue': false,
        'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
        ...props,
      },
      attrs,
    })
    mounted.push(wrapper)
    return wrapper
  }

  const key = (wrapper: VueWrapper) => wrapper.get('[role="checkbox"]')

  it('is one piano key in its own well, under its silkscreen label', () => {
    const wrapper = pause()
    expect(wrapper.classes()).toEqual(['fp-keys'])
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
    expect(wrapper.findAll(':scope > *').map(part => part.classes()[0])).toEqual(['fp-silk', 'fp-key'])
    expect(key(wrapper).element.tagName).toBe('BUTTON')
    expect(textOf(wrapper, key(wrapper).attributes('aria-labelledby'))).toBe('Pause')
  })

  it('latches down when pressed and comes up when pressed again', async () => {
    const wrapper = pause()
    expect(key(wrapper).attributes('aria-checked')).toBe('false')
    await key(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(key(wrapper).attributes('aria-checked')).toBe('true')
    await key(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('lights its strip in green by default, or the colour given', () => {
    expect(key(pause()).classes()).toEqual(['fp-key', 'fp-led-green'])
    expect(key(pause({ color: 'amber' })).classes()).toEqual(['fp-key', 'fp-led-amber'])
    expect(key(pause()).attributes('data-strip')).toBeUndefined()
  })

  it('can put its LED over the label, or go without', () => {
    const above = pause({ led: 'above', modelValue: true })
    expect(key(above).attributes('data-strip')).toBe('plain')
    expect(above.get('.fp-silk > .fp-led').classes()).toEqual(['fp-led', 'fp-led-green', 'fp-led-lit'])
    expect(textOf(above, key(above).attributes('aria-labelledby'))).toBe('Pause')

    const none = pause({ led: 'none' })
    expect(key(none).attributes('data-strip')).toBe('plain')
    expect(none.find('.fp-led').exists()).toBe(false)
  })

  it('lies on its side when vertical', () => {
    expect(pause({ orientation: 'vertical' }).attributes('data-orientation')).toBe('vertical')
  })

  it('does nothing while disabled', async () => {
    const wrapper = pause({ disabled: true })
    expect(key(wrapper).attributes('disabled')).toBeDefined()
    await key(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('puts class and style on the row and every other attribute on the key', () => {
    const wrapper = pause({ label: undefined }, { 'class': 'mx-2', 'style': 'margin: 1px;', 'aria-label': 'Pause', 'id': 'pause' })
    expect(wrapper.classes()).toEqual(['fp-keys', 'mx-2'])
    expect(wrapper.attributes('style')).toBe('margin: 1px;')
    expect(key(wrapper).attributes('aria-label')).toBe('Pause')
    expect(key(wrapper).attributes('id')).toBe('pause')
    // Without a label there is no silkscreen and nothing to point at.
    expect(wrapper.find('.fp-silk').exists()).toBe(false)
    expect(key(wrapper).attributes('aria-labelledby')).toBeUndefined()
  })
})

describe('fpCheckboxGroup', () => {
  const inputs: FpKeyOption[] = [
    { value: 'lowcut', label: 'Low cut' },
    { value: 'pad', label: 'Pad', color: 'amber' },
    { value: 'rec', label: 'Rec', color: 'red' },
    { value: 'sync', label: 'Sync', disabled: true },
  ]

  function inputGroup(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
    const wrapper = mount(FpCheckboxGroup, {
      attachTo: document.body,
      props: {
        'options': inputs,
        'modelValue': ['lowcut'],
        'onUpdate:modelValue': (value: string[]) => wrapper.setProps({ modelValue: value }),
        ...props,
      },
      attrs,
    })
    mounted.push(wrapper)
    return wrapper
  }

  const group = (wrapper: VueWrapper) => wrapper.get('[role="group"]')
  const keys = (wrapper: VueWrapper) => wrapper.findAll('[role="checkbox"]')

  it('is a row of piano keys in one well, each under its silkscreen label', () => {
    const wrapper = inputGroup()
    expect(group(wrapper).classes()).toEqual(['fp-keys'])
    expect(group(wrapper).attributes('data-orientation')).toBe('horizontal')
    expect(group(wrapper).findAll(':scope > *').map(part => part.classes()[0])).toEqual([
      'fp-silk',
      'fp-key',
      'fp-silk',
      'fp-key',
      'fp-silk',
      'fp-key',
      'fp-silk',
      'fp-key',
    ])
    expect(keys(wrapper).map(key => textOf(wrapper, key.attributes('aria-labelledby')))).toEqual(['Low cut', 'Pad', 'Rec', 'Sync'])
  })

  it('latches each key on its own', async () => {
    const wrapper = inputGroup()
    expect(keys(wrapper).map(key => key.attributes('aria-checked'))).toEqual(['true', 'false', 'false', 'false'])
    await keys(wrapper)[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['lowcut', 'rec']])
    await keys(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['rec']])
    expect(keys(wrapper).map(key => key.attributes('aria-checked'))).toEqual(['false', 'false', 'true', 'false'])
  })

  it('keeps every key a stop for Tab, as checkboxes are', () => {
    const wrapper = inputGroup()
    expect(keys(wrapper).slice(0, 3).map(key => key.attributes('tabindex'))).not.toContain('-1')
  })

  it('lights the strips in their LED colours, or puts the LEDs over the labels', () => {
    expect(keys(inputGroup()).map(key => key.classes()[1])).toEqual(['fp-led-green', 'fp-led-amber', 'fp-led-red', 'fp-led-green'])
    const above = inputGroup({ led: 'above' })
    expect(above.findAll('.fp-silk > .fp-led').map(led => led.classes().includes('fp-led-lit'))).toEqual([true, false, false, false])
    expect(keys(above).every(key => key.attributes('data-strip') === 'plain')).toBe(true)
  })

  it('stacks the keys when vertical', () => {
    expect(group(inputGroup({ orientation: 'vertical' })).attributes('data-orientation')).toBe('vertical')
  })

  it('wears the group\'s silkscreen label under the keys, which names the group', () => {
    const wrapper = inputGroup({ label: 'Input' })
    expect(wrapper.classes()).toEqual(['fp-unit'])
    const label = wrapper.get('.fp-unit > .fp-silk')
    expect(label.text()).toBe('Input')
    expect(group(wrapper).attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('disables one key, or all of them', async () => {
    const wrapper = inputGroup()
    await keys(wrapper)[3]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(keys(inputGroup({ disabled: true })).every(key => key.attributes('disabled') !== undefined)).toBe(true)
  })

  it('puts class and style on the unit and every other attribute on the group', () => {
    const wrapper = inputGroup({}, { 'class': 'mx-2', 'style': 'margin: 1px;', 'aria-label': 'Input', 'id': 'input' })
    expect(wrapper.classes()).toEqual(['fp-unit', 'mx-2'])
    expect(wrapper.attributes('style')).toBe('margin: 1px;')
    expect(group(wrapper).attributes('aria-label')).toBe('Input')
    expect(group(wrapper).attributes('id')).toBe('input')
  })
})
