<script setup lang="ts">
export type FpLedColor = 'green' | 'amber' | 'red'

export interface FpLedProps {
  color?: FpLedColor
  lit?: boolean
  /** Blinks twice when it lights, then holds, to confirm an action. Re-key the LED to blink again. */
  blink?: boolean
  /** Announces the LED as an image with this name. Without it the LED is decorative: say its state in text nearby. */
  label?: string
}

const props = withDefaults(defineProps<FpLedProps>(), { color: 'green' })
</script>

<template>
  <span
    class="fp-led"
    :class="[`fp-led-${props.color}`, { 'fp-led-lit': props.lit, 'fp-blink-twice': props.lit && props.blink }]"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label || undefined"
    :aria-hidden="props.label ? undefined : 'true'"
  />
</template>
