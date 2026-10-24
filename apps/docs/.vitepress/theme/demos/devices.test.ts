import { describe, expect, it } from 'vitest'
import { chordsIn, clockFace, stationAt, stepLength } from './devices'

describe('clockFace', () => {
  it('shows a 12-hour time, with noon and midnight as 12', () => {
    expect(clockFace(new Date(2026, 0, 1, 0, 5))).toEqual({ time: '12:05', pm: false })
    expect(clockFace(new Date(2026, 0, 1, 9, 41))).toEqual({ time: '9:41', pm: false })
    expect(clockFace(new Date(2026, 0, 1, 12, 0))).toEqual({ time: '12:00', pm: true })
    expect(clockFace(new Date(2026, 0, 1, 23, 59))).toEqual({ time: '11:59', pm: true })
  })
})

describe('stationAt', () => {
  it('finds a station on its frequency or a step either side', () => {
    expect(stationAt(101.1)).toBe('CHROME FM')
    expect(stationAt(101.0)).toBe('CHROME FM')
    expect(stationAt(101.2)).toBe('CHROME FM')
  })

  it('finds nothing between stations', () => {
    expect(stationAt(101.3)).toBeUndefined()
    expect(stationAt(87.5)).toBeUndefined()
  })
})

describe('stepLength', () => {
  it('gives an eighth note at the tempo', () => {
    expect(stepLength(120)).toBe(250)
    expect(stepLength(60)).toBe(500)
  })
})

describe('chordsIn', () => {
  it('names the six chords of a major key', () => {
    expect(chordsIn(0).map(chord => chord.name)).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am'])
  })

  it('wraps round the octave in a higher key', () => {
    expect(chordsIn(7).map(chord => chord.name)).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em'])
    expect(chordsIn(10).map(chord => chord.name)).toEqual(['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm'])
  })
})
