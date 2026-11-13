import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import FpButton from '../FpButton.vue'
import FpIcon from '../FpIcon.vue'
import { scan } from './axe'

// The scan has to bite: a control with no accessible name must fail it, in either skin.
describe('scan', () => {
  it.each(['silver', 'gunmetal'] as const)('rejects an icon-only button with no name in %s', async (skin) => {
    const wrapper = mount(FpButton, { slots: { default: () => h(FpIcon, { name: 'right' }) }, attachTo: document.body })
    await expect(scan(skin)).rejects.toThrow(/button-name/)
    wrapper.unmount()
  })

  it('passes the same button once it has a name', async () => {
    const wrapper = mount(FpButton, {
      attrs: { 'aria-label': 'Next track' },
      slots: { default: () => h(FpIcon, { name: 'right' }) },
      attachTo: document.body,
    })
    await expect(scan('silver')).resolves.toBeUndefined()
    wrapper.unmount()
  })
})
