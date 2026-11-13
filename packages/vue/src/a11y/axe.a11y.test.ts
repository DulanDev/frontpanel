import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import FpButton from '../FpButton.vue'
import FpIcon from '../FpIcon.vue'
import { scan } from './axe'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

// The scan has to bite: a control with no accessible name must fail it, in either skin.
describe('scan', () => {
  it.each(['silver', 'gunmetal'] as const)('rejects an icon-only button with no name in %s', async (skin) => {
    const wrapper = mount(FpButton, { slots: { default: () => h(FpIcon, { name: 'right' }) }, attachTo: document.body })
    mounted.push(wrapper)
    await expect(scan(skin)).rejects.toThrow(/button-name/)
  })

  it('passes the same button once it has a name', async () => {
    const wrapper = mount(FpButton, {
      attrs: { 'aria-label': 'Next track' },
      slots: { default: () => h(FpIcon, { name: 'right' }) },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    await expect(scan('silver')).resolves.toBeUndefined()
  })
})
