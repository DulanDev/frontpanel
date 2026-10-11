import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FpLcd from './FpLcd.vue'
import FpLcdLine from './FpLcdLine.vue'

describe('fpLcd', () => {
  it('is a pane of LCD glass holding its lines', () => {
    expect(mount(FpLcd, { slots: { default: 'READY' } }).html()).toBe('<div class="fp-lcd">READY</div>')
  })

  it('renders as another element', () => {
    expect(mount(FpLcd, { props: { as: 'section' } }).element.tagName).toBe('SECTION')
  })
})

describe('fpLcdLine', () => {
  it('prints its text in LCD type', () => {
    const wrapper = mount(FpLcdLine, { props: { text: '02:41' } })
    expect(wrapper.classes()).toEqual(['fp-lcd-line'])
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.text()).toBe('02:41')
    expect(wrapper.find('.fp-lcd-ghost').exists()).toBe(false)
  })

  it('shows unlit segments behind the text, hidden from assistive tech', () => {
    const wrapper = mount(FpLcdLine, { props: { text: '2:41', ghost: true } })
    const [ghost, text] = wrapper.findAll('span')
    expect(ghost!.classes()).toEqual(['fp-lcd-ghost'])
    expect(ghost!.attributes('aria-hidden')).toBe('true')
    expect(ghost!.text()).toBe('8888')
    expect(text!.text()).toBe('2:41')
  })

  it('fills a fixed number of cells with ghost segments', () => {
    const wrapper = mount(FpLcdLine, { props: { text: '7', ghost: true, cells: 3 } })
    expect(wrapper.get('.fp-lcd-ghost').text()).toBe('888')
  })

  it('redraws when its text changes, and only then', async () => {
    const wrapper = mount(FpLcdLine, { props: { text: 'C', redraw: true } })
    const first = wrapper.get('.fp-lcd-redraw').element
    await wrapper.setProps({ ghost: true })
    expect(wrapper.get('.fp-lcd-redraw').element).toBe(first)
    await wrapper.setProps({ text: 'Am' })
    expect(wrapper.get('.fp-lcd-redraw').element).not.toBe(first)
    expect(wrapper.get('.fp-lcd-redraw').text()).toBe('Am')
  })

  it('does not animate without redraw', async () => {
    const wrapper = mount(FpLcdLine, { props: { text: 'C' } })
    expect(wrapper.find('.fp-lcd-redraw').exists()).toBe(false)
  })

  it('renders as another element', () => {
    expect(mount(FpLcdLine, { props: { text: 'A', as: 'h2' } }).element.tagName).toBe('H2')
  })
})
