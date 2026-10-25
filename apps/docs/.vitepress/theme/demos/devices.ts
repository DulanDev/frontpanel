/*
 * The small home page devices' logic, kept apart from their timers: the clock radio's face and
 * stations, the rhythm box's step length, and the chord pad's chords in a key.
 */

/** The time as a 12-hour clock shows it, `h:mm`, and whether it is after noon. */
export function clockFace(date: Date): { time: string, pm: boolean } {
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return { time: `${hours % 12 || 12}:${minutes}`, pm: hours >= 12 }
}

/** The made-up stations on the clock radio's dial, in MHz. */
export const stations = [
  { frequency: 88.3, name: 'NIGHT JAZZ' },
  { frequency: 94.7, name: 'CITY POP' },
  { frequency: 101.1, name: 'CHROME FM' },
  { frequency: 105.9, name: 'TALK 106' },
]

/** The station a frequency is tuned to, within a step of the dial either side, if any. */
export function stationAt(frequency: number): string | undefined {
  return stations.find(station => Math.abs(station.frequency - frequency) < 0.15)?.name
}

/** Milliseconds per step of the rhythm box, whose steps are eighth notes. */
export function stepLength(bpm: number): number {
  return 60000 / bpm / 2
}

const NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
/** The keys the chord pad's dial offers, a semitone apart from C. */
export const keys = NOTES
/** The chords on the pad: the major key's I, ii, iii, IV, V and vi, as semitones above the key. */
const DEGREES = [
  { root: 0, minor: false, numeral: 'I' },
  { root: 2, minor: true, numeral: 'ii' },
  { root: 4, minor: true, numeral: 'iii' },
  { root: 5, minor: false, numeral: 'IV' },
  { root: 7, minor: false, numeral: 'V' },
  { root: 9, minor: true, numeral: 'vi' },
]

/** The pad's chords in a key, given as its index in `keys`. */
export function chordsIn(key: number): { name: string, numeral: string, minor: boolean }[] {
  return DEGREES.map(({ root, minor, numeral }) => ({
    name: `${NOTES[(key + root) % 12]!}${minor ? 'm' : ''}`,
    numeral,
    minor,
  }))
}
