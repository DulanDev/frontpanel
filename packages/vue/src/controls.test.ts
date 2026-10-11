import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import FpButton from './FpButton.vue'
import FpCap from './FpCap.vue'
import FpGelButton from './FpGelButton.vue'

describe('fpButton', () => {
  it('renders a chrome push button that does not submit forms', () => {
    const wrapper = mount(FpButton, { slots: { default: 'Play' } })
    const button = wrapper.get('button')
    expect(button.classes()).toEqual(['fp-chrome-btn'])
    expect(button.attributes('type')).toBe('button')
    expect(button.text()).toBe('Play')
  })

  it('is a plain button, not a toggle, unless pressed is set', () => {
    expect(mount(FpButton).get('button').attributes('aria-pressed')).toBeUndefined()
    expect(mount(FpButton, { props: { pressed: false } }).get('button').attributes('aria-pressed')).toBe('false')
    expect(mount(FpButton, { props: { pressed: true } }).get('button').attributes('aria-pressed')).toBe('true')
  })

  it('lets the caller set the type and pass native attributes', () => {
    const wrapper = mount(FpButton, { attrs: { type: 'submit', disabled: true } })
    expect(wrapper.get('button').attributes('type')).toBe('submit')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('emits clicks', async () => {
    const wrapper = mount(FpButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders as another element, with no button type', () => {
    const wrapper = mount(FpButton, { props: { as: 'a' }, attrs: { 'href': '/deck', 'aria-current': 'page' } })
    const link = wrapper.get('a')
    expect(link.classes()).toContain('fp-chrome-btn')
    expect(link.attributes('type')).toBeUndefined()
    expect(link.attributes('href')).toBe('/deck')
  })

  it('skins its only child with asChild', () => {
    const wrapper = mount(FpButton, {
      props: { asChild: true },
      slots: { default: () => h('a', { href: '/deck' }, 'Deck') },
    })
    const link = wrapper.get('a')
    expect(wrapper.element).toBe(link.element)
    expect(link.classes()).toEqual(['fp-chrome-btn'])
    expect(link.attributes('href')).toBe('/deck')
    expect(link.attributes('type')).toBeUndefined()
  })
})

describe('fpGelButton', () => {
  it('renders a gel pill button', () => {
    const button = mount(FpGelButton, { slots: { default: 'Save' } }).get('button')
    expect(button.classes()).toEqual(['fp-gel'])
    expect(button.attributes('type')).toBe('button')
    expect(button.text()).toBe('Save')
  })

  it('renders as another element', () => {
    const wrapper = mount(FpGelButton, { props: { as: 'a' }, attrs: { href: '/go' } })
    expect(wrapper.get('a').classes()).toContain('fp-gel')
    expect(wrapper.get('a').attributes('type')).toBeUndefined()
  })
})

describe('fpCap', () => {
  it('is white plastic by default', () => {
    const button = mount(FpCap, { slots: { default: 'C' } }).get('button')
    expect(button.classes()).toEqual(['fp-cap'])
    expect(button.attributes('type')).toBe('button')
  })

  it.each(['blue', 'amber', 'graphite', 'berry'] as const)('takes the %s colour', (color) => {
    const button = mount(FpCap, { props: { color } }).get('button')
    expect(button.classes()).toEqual(['fp-cap', `fp-cap-${color}`])
  })

  it('shows selection as pressed, never by colour alone', () => {
    expect(mount(FpCap).get('button').attributes('aria-pressed')).toBeUndefined()
    expect(mount(FpCap, { props: { pressed: true } }).get('button').attributes('aria-pressed')).toBe('true')
  })
})
