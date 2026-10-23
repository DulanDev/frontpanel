import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import FpButton from './FpButton.vue'
import FpMenu from './FpMenu.vue'
import FpMenuItem from './FpMenuItem.vue'
import FpMenuSeparator from './FpMenuSeparator.vue'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

// A File menu on a chrome button: Open, a link, a groove, and a disabled Eject.
function fileMenu(options: { props?: Record<string, unknown>, attrs?: Record<string, unknown>, onOpen?: () => void } = {}) {
  const wrapper = mount(FpMenu, {
    attachTo: document.body,
    props: options.props,
    attrs: options.attrs,
    slots: {
      trigger: () => h(FpButton, null, () => 'File'),
      default: () => [
        h(FpMenuItem, { onSelect: options.onOpen }, () => 'Open'),
        h(FpMenuItem, { as: 'a', href: '/help' }, () => 'Help'),
        h(FpMenuSeparator),
        h(FpMenuItem, { disabled: true }, () => 'Eject'),
      ],
    },
  })
  mounted.push(wrapper)
  return wrapper
}

const plate = () => document.querySelector<HTMLElement>('.fp-menu')

async function openWithKeys(wrapper: VueWrapper) {
  await wrapper.get('button').trigger('keydown', { key: 'Enter' })
  await flushPromises()
}

describe('fpMenu', () => {
  it('puts a menu button on its trigger, closed', () => {
    const button = fileMenu().get('button')
    expect(button.classes()).toEqual(['fp-chrome-btn'])
    expect(button.attributes('aria-haspopup')).toBe('menu')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(plate()).toBeNull()
  })

  it('drops a chrome plate of rows when opened from the keyboard', async () => {
    const wrapper = fileMenu()
    await openWithKeys(wrapper)
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')

    const menu = plate()!
    expect(menu.getAttribute('role')).toBe('menu')
    expect(menu.getAttribute('aria-labelledby')).toBe(wrapper.get('button').attributes('id'))
    expect([...menu.children].map(row => [row.className, row.getAttribute('role')])).toEqual([
      ['fp-menu-item', 'menuitem'],
      ['fp-menu-item', 'menuitem'],
      ['fp-menu-separator', 'separator'],
      ['fp-menu-item', 'menuitem'],
    ])
  })

  it('emits select and closes when a row is chosen', async () => {
    let chosen = 0
    const wrapper = fileMenu({ onOpen: () => chosen++ })
    await openWithKeys(wrapper)
    plate()!.querySelector<HTMLElement>('.fp-menu-item')!.click()
    await flushPromises()
    expect(chosen).toBe(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
  })

  it('renders a row as a link', async () => {
    const wrapper = fileMenu()
    await openWithKeys(wrapper)
    const link = plate()!.querySelector('a')!
    expect(link.className).toBe('fp-menu-item')
    expect(link.getAttribute('href')).toBe('/help')
  })

  it('marks a disabled row', async () => {
    const wrapper = fileMenu()
    await openWithKeys(wrapper)
    const eject = [...plate()!.querySelectorAll('.fp-menu-item')].at(-1)!
    expect(eject.hasAttribute('data-disabled')).toBe(true)
    expect(eject.getAttribute('aria-disabled')).toBe('true')
  })

  it('opens from v-model:open', async () => {
    fileMenu({ props: { open: true } })
    await flushPromises()
    expect(plate()).not.toBeNull()
  })

  it('puts class and other attributes on the plate', async () => {
    fileMenu({ props: { open: true }, attrs: { 'class': 'wide', 'data-test': 'file' } })
    await flushPromises()
    expect(plate()!.classList).toContain('wide')
    expect(plate()!.classList).toContain('fp-menu')
    expect(plate()!.getAttribute('data-test')).toBe('file')
  })

  it('carries the skin around its trigger to the plate', async () => {
    const host = document.createElement('div')
    host.dataset.fpSkin = 'gunmetal'
    document.body.append(host)
    const wrapper = mount(FpMenu, {
      attachTo: host,
      slots: { trigger: () => h(FpButton, null, () => 'File'), default: () => h(FpMenuItem, null, () => 'Open') },
    })
    mounted.push(wrapper)
    await openWithKeys(wrapper)
    expect(plate()!.closest('[data-fp-skin]')).not.toBe(host)
    expect(plate()!.dataset.fpSkin).toBe('gunmetal')
  })
})
