import { describe, expect, it } from 'vitest'
import { fitScale } from './fit'

const device = { width: 1000, height: 600 }

describe('fitScale', () => {
  it('scales to the available width', () => {
    expect(fitScale('width', { width: 500, height: 100 }, device, 1)).toBe(0.5)
  })

  it('scales to whichever side runs out first when containing', () => {
    expect(fitScale('contain', { width: 500, height: 600 }, device, 1)).toBe(0.5)
    expect(fitScale('contain', { width: 1000, height: 150 }, device, 1)).toBe(0.25)
  })

  it('never grows past the largest scale', () => {
    expect(fitScale('width', { width: 3000, height: 0 }, device, 1)).toBe(1)
    expect(fitScale('width', { width: 3000, height: 0 }, device, 2)).toBe(2)
  })

  it('has no scale until there is room to measure', () => {
    expect(fitScale('width', { width: 0, height: 600 }, device, 1)).toBeNull()
    expect(fitScale('contain', { width: 500, height: 0 }, device, 1)).toBeNull()
    expect(fitScale('width', { width: 500, height: 0 }, { width: 1000, height: 0 }, 1)).toBe(0.5)
    expect(fitScale('contain', { width: 500, height: 600 }, { width: 1000, height: 0 }, 1)).toBeNull()
  })
})
