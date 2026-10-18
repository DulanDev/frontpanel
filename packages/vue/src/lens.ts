/** How an LED's light spreads: an even fill, a soft hot spot over its chip, or a bright one. */
export type FpLens = 'flat' | 'diffused' | 'clear'

// Written out in full: Tailwind generates only the class names it finds in the source it scans.
export const lensClass: Record<FpLens, string> = {
  flat: 'fp-lens-flat',
  diffused: 'fp-lens-diffused',
  clear: 'fp-lens-clear',
}
