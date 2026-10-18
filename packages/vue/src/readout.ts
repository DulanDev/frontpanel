/*
 * The seven-segment readout's drawing: which segments each character lights, and the shape of
 * each segment. FpReadout draws with these; they are exported to draw a readout without Vue.
 */

// The segments each character lights: a top, b and c down the right, d bottom, e and f up the
// left, g across the middle. Lower case only where it draws differently from upper case.
const glyphs: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abdeg',
  '3': 'abcdg',
  '4': 'bcfg',
  '5': 'acdfg',
  '6': 'acdefg',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
  '-': 'g',
  '_': 'd',
  '°': 'abfg',
  ' ': '',
  'A': 'abcefg',
  'B': 'cdefg',
  'C': 'adef',
  'c': 'deg',
  'D': 'bcdeg',
  'E': 'adefg',
  'F': 'aefg',
  'G': 'acdef',
  'H': 'bcefg',
  'h': 'cefg',
  'I': 'ef',
  'J': 'bcde',
  'L': 'def',
  'N': 'ceg',
  'O': 'abcdef',
  'o': 'cdeg',
  'P': 'abefg',
  'R': 'eg',
  'S': 'acdfg',
  'T': 'defg',
  'U': 'bcdef',
  'u': 'cde',
  'Y': 'bcdfg',
}

/** The segments a character lights, as letters a to g; none for a character it cannot draw. */
export function fpReadoutGlyph(character: string): string {
  return glyphs[character] ?? glyphs[character.toUpperCase()] ?? ''
}

// Segment shapes on a 15 × 22 grid: six-sided bars 2 units thick, centred on the lines of a
// 10 × 20 figure eight, with a little gap at each joint.
const THICK = 2
const LONG = 9

function bar(cx: number, cy: number, across: boolean): string {
  const [half, edge] = [LONG / 2, THICK / 2]
  const points = across
    ? [[-half, 0], [-half + edge, -edge], [half - edge, -edge], [half, 0], [half - edge, edge], [-half + edge, edge]]
    : [[0, -half], [edge, -half + edge], [edge, half - edge], [0, half], [-edge, half - edge], [-edge, -half + edge]]
  return points.map(([x, y]) => `${cx + x!},${cy + y!}`).join(' ')
}

/** Each segment's polygon points on the readout cell's `0 0 15 22` viewBox; the decimal point is a circle at 13.5, 21. */
export const fpReadoutSegments = [
  { name: 'a', points: bar(6, 1, true) },
  { name: 'b', points: bar(11, 6, false) },
  { name: 'c', points: bar(11, 16, false) },
  { name: 'd', points: bar(6, 21, true) },
  { name: 'e', points: bar(1, 16, false) },
  { name: 'f', points: bar(1, 6, false) },
  { name: 'g', points: bar(6, 11, true) },
]
