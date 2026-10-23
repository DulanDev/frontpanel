import { describe, expect, it } from 'vitest'
import { bandsAt, clock, levelAt, marqueeFrame } from './player'

describe('clock', () => {
  it('shows minutes and seconds, two digits each', () => {
    expect(clock(0)).toBe('00:00')
    expect(clock(42)).toBe('00:42')
    expect(clock(192)).toBe('03:12')
  })
})

describe('marqueeFrame', () => {
  it('holds a title that fits its cells still', () => {
    expect(marqueeFrame('TWO BLINKS', 14, 0)).toBe('TWO BLINKS')
    expect(marqueeFrame('TWO BLINKS', 14, 37)).toBe('TWO BLINKS')
  })

  it('rests on the start of a long title, then steps it left a cell at a time', () => {
    const title = 'BACKLIGHT AT MIDNIGHT'
    expect(marqueeFrame(title, 8, 0)).toBe('BACKLIGH')
    expect(marqueeFrame(title, 8, 3)).toBe('BACKLIGH')
    expect(marqueeFrame(title, 8, 4)).toBe('ACKLIGHT')
    expect(marqueeFrame(title, 8, 5)).toBe('CKLIGHT ')
  })

  it('wraps round through a gap, back to the rest at the start', () => {
    // The title and its gap make a loop of 14 cells: a rest of 4 steps, then 13 steps of scroll.
    const frame = (step: number) => marqueeFrame('ABCDEFGHIJ', 6, step)
    expect(frame(12)).toBe('J    A')
    expect(frame(16)).toBe(' ABCDE')
    expect(frame(17)).toBe('ABCDEF')
  })
})

describe('levelAt', () => {
  it('stays within the range and moves with time', () => {
    const levels = Array.from({ length: 200 }, (_, i) => levelAt(i * 100, 0))
    expect(Math.min(...levels)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...levels)).toBeLessThanOrEqual(1)
    expect(new Set(levels.map(level => level.toFixed(2))).size).toBeGreaterThan(10)
  })

  it('gives the two channels different levels at the same moment', () => {
    expect(levelAt(1234, 0)).not.toBe(levelAt(1234, 1))
  })
})

describe('bandsAt', () => {
  it('gives each band a level within the range', () => {
    const bands = bandsAt(1234, 12)
    expect(bands).toHaveLength(12)
    for (const band of bands) {
      expect(band).toBeGreaterThanOrEqual(0)
      expect(band).toBeLessThanOrEqual(1)
    }
  })

  it('runs higher in the low bands than the high ones, over a stretch of play', () => {
    const sums = Array.from<number>({ length: 12 }).fill(0)
    for (let ms = 0; ms < 20000; ms += 100)
      bandsAt(ms, 12).forEach((band, index) => sums[index]! += band)
    expect(sums[1]!).toBeGreaterThan(sums[10]!)
  })
})
