import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FpIcon from './FpIcon.vue'
import { fpIconNames, fpIconPaths, toPath } from './icons'

describe('toPath', () => {
  it('draws each run of lit pixels as one 1 px tall rectangle', () => {
    expect(toPath(['.##.', '#..#'])).toBe('M1 0h2v1h-2zM0 1h1v1h-1zM3 1h1v1h-1z')
  })
})

describe('icon set', () => {
  it('draws every glyph on the 16 px grid', () => {
    expect(fpIconNames).toHaveLength(18)
    for (const name of fpIconNames)
      expect(fpIconPaths[name], name).toMatch(/^M/)
  })
})

describe('fpIcon', () => {
  it('is a decorative 16 px pixel glyph', () => {
    const svg = mount(FpIcon, { props: { name: 'close' } }).get('svg')
    expect(svg.classes()).toEqual(['fp-icon'])
    expect(svg.attributes('viewBox')).toBe('0 0 16 16')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.get('path').attributes('d')).toBe(fpIconPaths.close)
  })

  it('is announced when it carries a label', () => {
    const svg = mount(FpIcon, { props: { name: 'save', label: 'Saved' } }).get('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('Saved')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
  })
})
