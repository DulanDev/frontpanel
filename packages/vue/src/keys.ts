import type { FpLedColor } from './FpLed.vue'

/** One key in an FpRadioGroup or FpCheckboxGroup. */
export interface FpKeyOption {
  value: string
  /** Its silkscreen label, printed over the key, which also names it. */
  label: string
  disabled?: boolean
  /** The colour its LED lights in. Unset, it takes the group's colour. */
  color?: FpLedColor
}

/**
 * Where a piano key's light is: the strip at the foot of the key is the LED, an LED sits over its
 * label, or there is none and the strip is plain plastic.
 */
export type FpKeyLed = 'strip' | 'above' | 'none'

// Written out in full: Tailwind generates only the class names it finds in the source it scans.
export const ledColorClass: Record<FpLedColor, string> = { green: 'fp-led-green', amber: 'fp-led-amber', red: 'fp-led-red' }
