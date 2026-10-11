import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import FpDevice from './FpDevice.vue'

/** A ResizeObserver the test fires by hand, after setting the sizes it should see. */
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = []
  observed: Element[] = []
  disconnected = false
  constructor(private callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this)
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  disconnect() {
    this.disconnected = true
  }

  unobserve() {}

  fire() {
    this.callback([], this as unknown as ResizeObserver)
  }
}

function setSize(element: Element, sizes: Record<string, number>) {
  for (const [key, value] of Object.entries(sizes))
    Object.defineProperty(element, key, { configurable: true, value })
}

/** Gives the stage its room and the device its natural height, then lets the observer report. */
async function measure(wrapper: VueWrapper, room: { width: number, height: number }, deviceHeight: number) {
  setSize(wrapper.element, { clientWidth: room.width, clientHeight: room.height })
  setSize(wrapper.get('.fp-device-rim').element, { offsetHeight: deviceHeight })
  FakeResizeObserver.instances.at(-1)!.fire()
  await nextTick()
}

/** Mounts a device and waits a tick: it starts observing once its elements are in place. */
async function mountDevice(props: InstanceType<typeof FpDevice>['$props']) {
  const wrapper = mount(FpDevice, { props })
  await nextTick()
  return wrapper
}

beforeEach(() => {
  FakeResizeObserver.instances = []
  vi.stubGlobal('ResizeObserver', FakeResizeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fpDevice', () => {
  it('sets a body in a chrome rim on the backdrop', () => {
    const wrapper = mount(FpDevice, { slots: { default: '<p>Panel</p>' } })
    expect(wrapper.classes()).toEqual(['fp-device-backdrop'])
    const rim = wrapper.get('.fp-device-rim')
    expect(rim.get('.fp-device-body').html()).toContain('<p>Panel</p>')
  })

  it('leaves out the backdrop and the rim when asked', () => {
    const wrapper = mount(FpDevice, { props: { backdrop: false, rim: false }, slots: { default: 'Panel' } })
    expect(wrapper.classes()).toEqual([])
    expect(wrapper.find('.fp-device-rim').exists()).toBe(false)
    expect(wrapper.get('.fp-device-body').text()).toBe('Panel')
  })

  it('leaves its size to the page unless it fits', () => {
    const wrapper = mount(FpDevice, { props: { width: 800 } })
    expect(wrapper.get('.fp-device-rim').attributes('style')).toBeUndefined()
    expect(FakeResizeObserver.instances).toHaveLength(0)
  })

  it('takes its width from the page, never from the device it scales', async () => {
    // Otherwise a scaled device holds its column open at its current size and never shrinks.
    const wrapper = await mountDevice({ fit: 'width', width: 1000 })
    expect(wrapper.attributes('style')).toContain('contain: inline-size')
    expect(mount(FpDevice).attributes('style')).toBeUndefined()
  })

  it('stays hidden until it has measured its room', async () => {
    const wrapper = await mountDevice({ fit: 'width', width: 1000 })
    expect(wrapper.get('.fp-device-rim').attributes('style')).toContain('visibility: hidden')
  })

  it('scales its design size down to the width it has', async () => {
    const wrapper = await mountDevice({ fit: 'width', width: 1000 })
    await measure(wrapper, { width: 500, height: 0 }, 600)

    const device = wrapper.get('.fp-device-rim').attributes('style')
    expect(device).toContain('width: 1000px')
    // The design width includes the rim, so the box reserved for it holds all of it.
    expect(device).toContain('box-sizing: border-box')
    expect(device).toContain('scale: 0.5')
    expect(device).toContain('transform-origin: 0 0')
    expect(device).not.toContain('visibility')
    // The box around it takes the scaled size, so the page flows around the device as it looks.
    const box = wrapper.get('.fp-device-rim').element.parentElement!.getAttribute('style')
    expect(box).toContain('width: 500px')
    expect(box).toContain('height: 300px')
  })

  it('fits inside both sides when containing, at a fixed design height', async () => {
    const wrapper = await mountDevice({ fit: 'contain', width: 1000, height: 600 })
    await measure(wrapper, { width: 800, height: 300 }, 600)
    const device = wrapper.get('.fp-device-rim').attributes('style')
    expect(device).toContain('height: 600px')
    expect(device).toContain('scale: 0.5')
  })

  it('does not grow past its design size unless allowed', async () => {
    const wrapper = await mountDevice({ fit: 'width', width: 500 })
    await measure(wrapper, { width: 2000, height: 0 }, 300)
    expect(wrapper.get('.fp-device-rim').attributes('style')).toContain('scale: 1')

    await wrapper.setProps({ maxScale: 2 })
    expect(wrapper.get('.fp-device-rim').attributes('style')).toContain('scale: 2')
  })

  it('scales the bare body when it has no rim', async () => {
    const wrapper = await mountDevice({ fit: 'width', width: 1000, rim: false })
    setSize(wrapper.element, { clientWidth: 250, clientHeight: 0 })
    setSize(wrapper.get('.fp-device-body').element, { offsetHeight: 400 })
    FakeResizeObserver.instances.at(-1)!.fire()
    await nextTick()
    expect(wrapper.get('.fp-device-body').attributes('style')).toContain('scale: 0.25')
  })

  it('warns and stays unscaled when it fits without a design width', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = await mountDevice({ fit: 'width' })
    expect(warn.mock.calls[0]?.[0]).toContain('needs a design width')
    expect(wrapper.get('.fp-device-rim').attributes('style')).toBeUndefined()
    expect(FakeResizeObserver.instances).toHaveLength(0)
  })

  it('stops observing when it unmounts', async () => {
    const wrapper = await mountDevice({ fit: 'width', width: 1000 })
    const observer = FakeResizeObserver.instances.at(-1)!
    expect(observer.observed).toHaveLength(2)
    wrapper.unmount()
    expect(observer.disconnected).toBe(true)
  })
})
