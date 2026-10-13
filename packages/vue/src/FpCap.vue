<script setup lang="ts">
// A molded-plastic cap. Selection shows as pressed in with a ring, never by colour alone.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export type FpCapColor = 'white' | 'blue' | 'amber' | 'graphite' | 'berry'

export interface FpCapProps extends PrimitiveProps {
  /** The plastic. Each colour carries its own label colour. */
  color?: FpCapColor
  /** Holds the cap down with a ring around it and sets `aria-pressed`. Leave it unset for a plain cap. */
  pressed?: boolean
}

const props = withDefaults(defineProps<FpCapProps>(), { as: 'button', color: 'white', pressed: undefined })

// Written out in full: Tailwind generates only the class names it finds in the source it scans.
const colorClass: Record<FpCapColor, string | undefined> = {
  white: undefined,
  blue: 'fp-cap-blue',
  amber: 'fp-cap-amber',
  graphite: 'fp-cap-graphite',
  berry: 'fp-cap-berry',
}
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    class="fp-cap"
    :class="colorClass[props.color]"
    :type="props.as === 'button' && !props.asChild ? 'button' : undefined"
    :aria-pressed="props.pressed"
  >
    <slot />
  </Primitive>
</template>
