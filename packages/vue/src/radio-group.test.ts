import type { VueWrapper } from '@vue/test-utils'
import type { FpKeyOption } from './keys'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import FpRadioGroup from './FpRadioGroup.vue'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

const sources: FpKeyOption[] = [
  { value: 'cd', label: 'CD' },
  { value: 'tape', label: 'Tape' },
  { value: 'aux', label: 'Aux', color: 'amber' },
  { value: 'line', label: 'Line', disabled: true },
]

function sourceGroup(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(FpRadioGroup, {
    attachTo: document.body,
    props: {
      'options': sources,
      'modelValue': 'tape',
      'onUpdate:modelValue': (value: string | undefined) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
    attrs,
  })
  mounted.push(wrapper)
  return wrapper
}

const group = (wrapper: VueWrapper) => wrapper.get('[role="radiogroup"]')
const keys = (wrapper: VueWrapper) => wrapper.findAll('[role="radio"]')

// The text of the element an attribute points at by id.
function textOf(wrapper: VueWrapper, id: string | undefined) {
  return id ? wrapper.find(`[id="${id}"]`).text() : undefined
}

describe('fpRadioGroup', () => {
  it('is a row of piano keys, each under its silkscreen label', () => {
    const wrapper = sourceGroup()
    expect(group(wrapper).classes()).toEqual(['fp-keys'])
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
    expect(keys(wrapper).map(key => key.element.tagName)).toEqual(['BUTTON', 'BUTTON', 'BUTTON', 'BUTTON'])
  })

  it('names each key by its label', () => {
    const wrapper = sourceGroup()
    expect(keys(wrapper).map(key => textOf(wrapper, key.attributes('aria-labelledby')))).toEqual(['CD', 'Tape', 'Aux', 'Line'])
  })

  it('latches the chosen key', () => {
    const wrapper = sourceGroup()
    expect(keys(wrapper).map(key => key.attributes('aria-checked'))).toEqual(['false', 'true', 'false', 'false'])
  })

  it('moves the latch to a pressed key', async () => {
    const wrapper = sourceGroup()
    await keys(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['cd'])
    expect(keys(wrapper).map(key => key.attributes('aria-checked'))).toEqual(['true', 'false', 'false', 'false'])
  })

  it('lights the strip of the latched key in its LED colour, green unless set', () => {
    const wrapper = sourceGroup()
    expect(keys(wrapper).map(key => key.classes())).toEqual([
      ['fp-key', 'fp-led-green'],
      ['fp-key', 'fp-led-green'],
      ['fp-key', 'fp-led-amber'],
      ['fp-key', 'fp-led-green'],
    ])
    expect(keys(wrapper).every(key => key.attributes('data-strip') === undefined)).toBe(true)
  })

  it('takes one LED colour for the whole row', () => {
    const wrapper = sourceGroup({ color: 'red' })
    expect(keys(wrapper).map(key => key.classes()[1])).toEqual(['fp-led-red', 'fp-led-red', 'fp-led-amber', 'fp-led-red'])
  })

  it('can put the LEDs over the labels instead, leaving the strips plain', () => {
    const wrapper = sourceGroup({ led: 'above' })
    expect(keys(wrapper).map(key => key.attributes('data-strip'))).toEqual(['plain', 'plain', 'plain', 'plain'])
    expect(keys(wrapper).map(key => key.classes())).toEqual([['fp-key'], ['fp-key'], ['fp-key'], ['fp-key']])
    const leds = wrapper.findAll('.fp-silk > .fp-led')
    expect(leds.map(led => led.classes())).toEqual([
      ['fp-led', 'fp-led-green'],
      ['fp-led', 'fp-led-green', 'fp-led-lit'],
      ['fp-led', 'fp-led-amber'],
      ['fp-led', 'fp-led-green'],
    ])
    expect(leds.map(led => led.attributes('aria-hidden'))).toEqual(['true', 'true', 'true', 'true'])
    // The LED adds nothing to the name.
    expect(textOf(wrapper, keys(wrapper)[1]!.attributes('aria-labelledby'))).toBe('Tape')
  })

  it('can go without LEDs', () => {
    const wrapper = sourceGroup({ led: 'none' })
    expect(keys(wrapper).map(key => key.attributes('data-strip'))).toEqual(['plain', 'plain', 'plain', 'plain'])
    expect(wrapper.find('.fp-led').exists()).toBe(false)
  })

  it('lays the keys on their side, stacked, when vertical', () => {
    expect(group(sourceGroup()).attributes('data-orientation')).toBe('horizontal')
    const vertical = group(sourceGroup({ orientation: 'vertical' }))
    expect(vertical.attributes('data-orientation')).toBe('vertical')
    expect(vertical.attributes('aria-orientation')).toBe('vertical')
  })

  it('wears the group\'s silkscreen label under the keys, which names the group', () => {
    const wrapper = sourceGroup({ label: 'Source' })
    expect(wrapper.classes()).toEqual(['fp-unit'])
    const label = wrapper.get('.fp-unit > .fp-silk')
    expect(label.text()).toBe('Source')
    expect(group(wrapper).attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('disables one key, or all of them', async () => {
    const wrapper = sourceGroup()
    expect(keys(wrapper).map(key => key.attributes('disabled') !== undefined)).toEqual([false, false, false, true])
    await keys(wrapper)[3]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    const all = sourceGroup({ disabled: true })
    expect(keys(all).every(key => key.attributes('disabled') !== undefined)).toBe(true)
  })

  it('puts class and style on the unit and every other attribute on the group', () => {
    const wrapper = sourceGroup({}, { 'class': 'mx-2', 'style': 'margin: 1px;', 'aria-label': 'Source', 'id': 'source' })
    expect(wrapper.classes()).toEqual(['fp-unit', 'mx-2'])
    expect(wrapper.attributes('style')).toBe('margin: 1px;')
    expect(group(wrapper).attributes('aria-label')).toBe('Source')
    expect(group(wrapper).attributes('id')).toBe('source')
  })
})
