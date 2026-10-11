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
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    class="fp-cap"
    :class="props.color === 'white' ? undefined : `fp-cap-${props.color}`"
    :type="props.as === 'button' && !props.asChild ? 'button' : undefined"
    :aria-pressed="props.pressed"
  >
    <slot />
  </Primitive>
</template>
