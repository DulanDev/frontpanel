import type { VueWrapper } from '@vue/test-utils'
import type { VNodeChild } from 'vue'
import type { ScanOptions } from './a11y/axe'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { scan } from './a11y/axe'
import * as kit from './index'

/**
 * One realistic use of a component, in a state that changes what a screen reader gets. `covers`
 * names the exports it exercises: the guard below fails for any component no fixture covers.
 */
interface Fixture {
  name: string
  covers: string[]
  render: () => VNodeChild
  /** Set to false for a fixture that renders its own device. Otherwise it sits on one, as in use. */
  onDevice?: boolean
  /** Gets the fixture into the state to scan, such as opening a menu. */
  prepare?: (wrapper: VueWrapper) => Promise<void>
  /** Only for markup Reka UI owns: each entry says why and links the upstream issue. */
  disabledRules?: ScanOptions['disabledRules']
}

const sources: kit.FpKeyOption[] = [
  { value: 'cd', label: 'CD' },
  { value: 'tape', label: 'Tape' },
  { value: 'aux', label: 'Aux', color: 'amber' },
  { value: 'line', label: 'Line', disabled: true },
]

const fixtures: Fixture[] = [
  // Buttons
  {
    name: 'button, plain and disabled',
    covers: ['FpButton'],
    render: () => [
      h(kit.FpButton, null, () => 'Play'),
      h(kit.FpButton, { disabled: true }, () => 'Eject'),
    ],
  },
  {
    name: 'button, toggle pressed and released',
    covers: ['FpButton'],
    render: () => [
      h(kit.FpButton, { pressed: true }, () => 'Loop'),
      h(kit.FpButton, { pressed: false }, () => 'Shuffle'),
    ],
  },
  {
    name: 'button, icon only with a name, and as a link',
    covers: ['FpButton', 'FpIcon'],
    render: () => [
      h(kit.FpButton, { 'aria-label': 'Next track' }, () => h(kit.FpIcon, { name: 'right' })),
      h(kit.FpButton, { as: 'a', href: '/deck' }, () => 'Deck'),
    ],
  },
  {
    name: 'button group',
    covers: ['FpButtonGroup', 'FpButton'],
    render: () => h(kit.FpButtonGroup, { 'aria-label': 'Transport' }, () => [
      h(kit.FpButton, null, () => 'Back'),
      h(kit.FpButton, null, () => 'Stop'),
      h(kit.FpButton, null, () => 'Forward'),
    ]),
  },
  {
    name: 'gel button',
    covers: ['FpGelButton'],
    render: () => [
      h(kit.FpGelButton, null, () => 'Power'),
      h(kit.FpGelButton, { disabled: true }, () => 'Eject'),
    ],
  },
  {
    name: 'caps, default, selected and coloured',
    covers: ['FpCap'],
    render: () => [
      h(kit.FpCap, null, () => 'A'),
      h(kit.FpCap, { pressed: true }, () => 'B'),
      h(kit.FpCap, { color: 'blue', pressed: false }, () => 'C'),
    ],
  },

  // Keys, switches and sliders
  {
    name: 'checkbox, off, on and disabled',
    covers: ['FpCheckbox'],
    render: () => [
      h(kit.FpCheckbox, { label: 'Pause', modelValue: false }),
      h(kit.FpCheckbox, { label: 'Repeat', modelValue: true, orientation: 'vertical' }),
      h(kit.FpCheckbox, { label: 'Mute', modelValue: false, disabled: true }),
    ],
  },
  {
    name: 'checkbox group',
    covers: ['FpCheckboxGroup'],
    render: () => h(kit.FpCheckboxGroup, { label: 'Outputs', options: sources, modelValue: ['tape'] }),
  },
  {
    name: 'radio group, horizontal and vertical',
    covers: ['FpRadioGroup'],
    render: () => [
      h(kit.FpRadioGroup, { label: 'Source', options: sources, modelValue: 'tape' }),
      h(kit.FpRadioGroup, { label: 'Input', options: sources, modelValue: 'cd', orientation: 'vertical', led: 'above' }),
    ],
  },
  {
    name: 'switch, on, off, horizontal and disabled',
    covers: ['FpSwitch'],
    render: () => [
      h(kit.FpSwitch, { label: 'Power', modelValue: true }),
      h(kit.FpSwitch, { label: 'Loudness', modelValue: false, orientation: 'horizontal', labelPlacement: 'start' }),
      h(kit.FpSwitch, { label: 'Lock', modelValue: false, disabled: true }),
    ],
  },
  {
    name: 'slider, vertical, horizontal and disabled',
    covers: ['FpSlider'],
    render: () => [
      h(kit.FpSlider, { label: 'Volume', modelValue: 40, valueText: (value: number) => `${value} percent` }),
      h(kit.FpSlider, { label: 'Balance', modelValue: 50, orientation: 'horizontal' }),
      h(kit.FpSlider, { label: 'Bass', modelValue: 20, disabled: true }),
    ],
  },
  {
    name: 'knob, with a value text, and disabled',
    covers: ['FpKnob'],
    render: () => [
      h(kit.FpKnob, { label: 'Gain', modelValue: 30, valueText: (value: number) => `${value} decibels` }),
      h(kit.FpKnob, { label: 'Tone', modelValue: 70, disabled: true }),
    ],
  },

  // Displays
  {
    name: 'lcd with lines',
    covers: ['FpLcd', 'FpLcdLine'],
    render: () => h(kit.FpLcd, null, () => [
      h(kit.FpLcdLine, { 'text': 'TRACK 04 / 12', 'aria-live': 'polite' }),
      h(kit.FpLcdLine, { text: 'SIDE B', ghost: true }),
    ]),
  },
  {
    name: 'readout and meter',
    covers: ['FpReadout', 'FpMeter'],
    render: () => [
      h(kit.FpReadout, { 'value': '03:42', 'digits': 5, 'aria-live': 'polite' }),
      h(kit.FpMeter, { label: 'Level left', value: 70 }),
      h(kit.FpMeter, { label: 'Level right', value: 45, orientation: 'horizontal', valueText: (value: number) => `${value} percent` }),
    ],
  },
  {
    name: 'leds and icons, decorative and labelled',
    covers: ['FpLed', 'FpIcon'],
    render: () => [
      h(kit.FpLed, { lit: true }),
      h(kit.FpLed, { color: 'red', lit: true, label: 'Recording' }),
      h(kit.FpLed, { color: 'amber', label: 'Standby' }),
      h(kit.FpIcon, { name: 'right' }),
      h(kit.FpIcon, { name: 'close', label: 'Close' }),
    ],
  },

  // Structure
  {
    name: 'device with a housing, well, silkscreen and screws',
    covers: ['FpDevice', 'FpHousing', 'FpWell', 'FpSilk', 'FpScrew'],
    onDevice: false,
    render: () => h(kit.FpDevice, { fit: 'none' }, () => [
      h(kit.FpScrew),
      h(kit.FpHousing, null, () => 'Deck'),
      h(kit.FpWell, null, () => h(kit.FpSilk, { as: 'h3' }, () => 'Transport')),
      h(kit.FpSilk, null, () => 'Stereo'),
    ]),
  },
  {
    name: 'window, closable',
    covers: ['FpWindow'],
    render: () => h(kit.FpWindow, { title: 'Settings', level: 3, closable: true }, () => h('p', null, 'Output device')),
  },
  {
    name: 'menu, open',
    covers: ['FpMenu', 'FpMenuItem', 'FpMenuSeparator'],
    render: () => h(kit.FpMenu, null, {
      trigger: () => h(kit.FpButton, null, () => 'File'),
      default: () => [
        h(kit.FpMenuItem, null, () => 'Open'),
        h(kit.FpMenuItem, { as: 'a', href: '/help' }, () => 'Help'),
        h(kit.FpMenuSeparator),
        h(kit.FpMenuItem, { disabled: true }, () => 'Eject'),
      ],
    }),
    // Reka's modal menu puts aria-hidden on the app root while the trigger inside it stays tabbable.
    // Focus is trapped in the menu, so the trigger can't be reached. Same pattern as Radix, whose
    // markup Reka follows: https://github.com/radix-ui/primitives/issues/3495. No Reka issue is
    // filed for it yet. Every other rule still runs on the open menu.
    disabledRules: [
      { id: 'aria-hidden-focus', reason: 'modal menu hides the app root; its trigger stays focusable but focus is trapped in the menu' },
    ],
    prepare: async (wrapper) => {
      await wrapper.get('button').trigger('keydown', { key: 'Enter' })
      await flushPromises()
      expect(document.querySelector('[role="menu"]')).not.toBeNull()
    },
  },
]

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  // Leave nothing for the next fixture: the open menu's scroll lock sits on the body and the skin on the root.
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
  document.body.removeAttribute('data-scroll-locked')
  delete document.documentElement.dataset.fpSkin
})

describe('fixtures', () => {
  it('cover every component the package exports', () => {
    // Components are objects; the icon list and the glyph helper are not, whatever they are called.
    const components = Object.entries(kit).filter(([name, value]) => /^Fp[A-Z]/.test(name) && typeof value === 'object').map(([name]) => name)
    const covered = new Set(fixtures.flatMap(fixture => fixture.covers))
    expect(components.filter(name => !covered.has(name))).toEqual([])
  })

  it('name only exports that exist', () => {
    const unknown = fixtures.flatMap(fixture => fixture.covers).filter(name => !(name in kit))
    expect(unknown).toEqual([])
  })
})

describe.each(['silver', 'gunmetal'] as const)('%s skin', (skin) => {
  it.each(fixtures)('$name has no accessibility violations', async ({ name, render, onDevice = true, prepare, disabledRules }) => {
    // Gunmetal's text is light on a dark panel, so a control needs the device under it, as in use.
    const content = () => onDevice ? h(kit.FpDevice, { backdrop: false }, () => render()) : render()
    const wrapper = mount({ render: content }, { attachTo: document.body })
    mounted.push(wrapper)
    await prepare?.(wrapper)
    await scan(skin, { label: name, disabledRules })
  })
})
