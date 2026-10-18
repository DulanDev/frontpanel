/*
 * Which segments each character lights on the seven-segment readout. FpReadout draws with this;
 * it is exported to light a readout without Vue.
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
