<script setup lang="ts">
export type FpLedColor = 'green' | 'amber' | 'red'

export interface FpLedProps {
  /** The colour it lights in. */
  color?: FpLedColor
  /** Lights the LED, with a glow. */
  lit?: boolean
  /** Blinks twice when it lights, then holds, to confirm an action. Re-key the LED to blink again. */
  blink?: boolean
  /** Announces the LED as an image with this name. Without it the LED is decorative: say its state in text nearby. */
  label?: string
}

const props = withDefaults(defineProps<FpLedProps>(), { color: 'green' })

// Written out in full: Tailwind generates only the class names it finds in the source it scans.
const colorClass: Record<FpLedColor, string> = { green: 'fp-led-green', amber: 'fp-led-amber', red: 'fp-led-red' }
</script>

<template>
  <span
    class="fp-led"
    :class="[colorClass[props.color], { 'fp-led-lit': props.lit, 'fp-blink-twice': props.lit && props.blink }]"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label || undefined"
    :aria-hidden="props.label ? undefined : 'true'"
  />
</template>
