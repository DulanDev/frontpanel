<script setup lang="ts">
// A seven-segment readout: LED digits in a dark housing, with the unlit segments faintly showing.
// Reka has no display like this, so it is our own. Screen readers get the value as text.
import type { FpLedColor } from './FpLed.vue'
import { computed } from 'vue'
import { fpReadoutGlyph, fpReadoutSegments } from './readout'

export interface FpReadoutProps {
  /**
   * What it shows. Digits, a minus, a space and the letters a seven-segment display can draw; a `.`
   * lights the decimal point of the digit before it, and a `:` adds a colon.
   */
  value: string | number
  /** How many digit cells it has, padded with dark cells on the left. Colons do not count. */
  digits?: number
  /** The colour its segments light in. */
  color?: FpLedColor
  /** Turns the value into the words a screen reader says, such as `v => `${v} dB``. */
  valueText?: (value: string) => string
}

const props = withDefaults(defineProps<FpReadoutProps>(), { color: 'green' })

// Written out in full: Tailwind generates only the class names it finds in the source it scans.
const colorClass: Record<FpLedColor, string> = { green: 'fp-led-green', amber: 'fp-led-amber', red: 'fp-led-red' }

type Cell = { colon: true } | { colon: false, lit: string, dot: boolean }

const text = computed(() => String(props.value))

const cells = computed(() => {
  const drawn: Cell[] = []
  for (const character of text.value) {
    const last = drawn.at(-1)
    if (character === ':')
      drawn.push({ colon: true })
    else if (character === '.' && last && !last.colon && !last.dot)
      last.dot = true
    else if (character === '.')
      drawn.push({ colon: false, lit: '', dot: true })
    else
      drawn.push({ colon: false, lit: fpReadoutGlyph(character), dot: false })
  }
  const shown = drawn.filter(cell => !cell.colon).length
  const padding = Array.from({ length: Math.max(0, (props.digits ?? 0) - shown) }, (): Cell => ({ colon: false, lit: '', dot: false }))
  return [...padding, ...drawn]
})
</script>

<template>
  <span class="fp-readout" :class="colorClass[props.color]">
    <span class="fp-readout-text">{{ props.valueText ? props.valueText(text) : text }}</span>
    <template v-for="(cell, index) in cells" :key="index">
      <svg v-if="cell.colon" viewBox="0 0 5 22" class="fp-readout-cell" data-colon aria-hidden="true">
        <circle cx="2.5" cy="7" r="1.2" data-lit />
        <circle cx="2.5" cy="15" r="1.2" data-lit />
      </svg>
      <svg v-else viewBox="0 0 15 22" class="fp-readout-cell" aria-hidden="true">
        <polygon
          v-for="segment in fpReadoutSegments"
          :key="segment.name"
          :points="segment.points"
          :data-segment="segment.name"
          :data-lit="cell.lit.includes(segment.name) ? '' : undefined"
        />
        <circle cx="13.5" cy="21" r="1.2" data-segment="dp" :data-lit="cell.dot ? '' : undefined" />
      </svg>
    </template>
  </span>
</template>
