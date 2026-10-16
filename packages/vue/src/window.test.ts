import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import FpWindow from './FpWindow.vue'

describe('fpWindow', () => {
  it('is a module region named by its title bar', () => {
    const wrapper = mount(FpWindow, { props: { title: 'Settings' }, slots: { default: '<p>Body</p>' } })
    const section = wrapper.get('section')
    expect(section.classes().sort()).toEqual(['fp-module', 'fp-window'])

    const heading = wrapper.get('.fp-module-title h2')
    expect(heading.classes()).toEqual(['fp-silk', 'fp-window-title'])
    expect(heading.text()).toBe('Settings')
    expect(section.attributes('aria-labelledby')).toBe(heading.attributes('id'))

    expect(wrapper.get('.fp-window-body').html()).toBe('<div class="fp-window-body">\n  <p>Body</p>\n</div>')
  })

  it('gives every window its own title id', () => {
    const wrapper = mount(() => [h(FpWindow, { title: 'A' }), h(FpWindow, { title: 'B' })])
    const ids = wrapper.findAll('h2').map(heading => heading.attributes('id'))
    expect(new Set(ids).size).toBe(2)
  })

  it('takes the heading level of its place in the page', () => {
    expect(mount(FpWindow, { props: { title: 'Mixer', level: 3 } }).find('h3').text()).toBe('Mixer')
  })

  it('has no close button unless closable', () => {
    expect(mount(FpWindow, { props: { title: 'Settings' } }).find('button').exists()).toBe(false)
  })

  it('closes from a chrome button in the title bar', async () => {
    const wrapper = mount(FpWindow, { props: { title: 'Settings', closable: true } })
    const close = wrapper.get('.fp-module-title button')
    expect(close.classes()).toContain('fp-chrome-btn')
    expect(close.attributes('aria-label')).toBe('Close Settings')
    expect(close.find('svg.fp-icon').exists()).toBe(true)
    await close.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('takes its own close label', () => {
    const wrapper = mount(FpWindow, { props: { title: 'Réglages', closable: true, closeLabel: 'Fermer' } })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Fermer')
  })

  it('puts extra title-bar controls before the close button', () => {
    const wrapper = mount(FpWindow, {
      props: { title: 'Saved', closable: true },
      slots: { actions: '<button type="button" class="extra">Sort</button>' },
    })
    const buttons = wrapper.findAll('.fp-module-title button')
    expect(buttons.map(button => button.classes()[0])).toEqual(['extra', 'fp-chrome-btn'])
  })

  it('renders as another landmark element', () => {
    const wrapper = mount(FpWindow, { props: { title: 'Inspector', as: 'aside' } })
    expect(wrapper.find('section').exists()).toBe(false)
    const aside = wrapper.get('aside')
    expect(aside.classes().sort()).toEqual(['fp-module', 'fp-window'])
    expect(aside.attributes('aria-labelledby')).toBe(wrapper.get('h2').attributes('id'))
  })

  it('leaves the body unpadded when flush', () => {
    const wrapper = mount(FpWindow, { props: { title: 'Tracks', flush: true }, slots: { default: '<ol></ol>' } })
    const body = wrapper.get('.fp-module-title + div')
    expect(body.classes()).toEqual([])
    expect(body.find('ol').exists()).toBe(true)
  })

  it('wears the sheet panel instead of the module as a sheet', () => {
    const section = mount(FpWindow, { props: { title: 'Settings', sheet: true } }).get('section')
    expect(section.classes().sort()).toEqual(['fp-sheet-panel', 'fp-window'])
  })
})
