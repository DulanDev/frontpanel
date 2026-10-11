<script setup lang="ts">
// A small hardware push button in brushed chrome.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export interface FpButtonProps extends PrimitiveProps {
  /** Holds the button down and sets `aria-pressed`, for a toggle. Leave it unset for a plain push button. */
  pressed?: boolean
}

const props = withDefaults(defineProps<FpButtonProps>(), { as: 'button', pressed: undefined })
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    class="fp-chrome-btn"
    :type="props.as === 'button' && !props.asChild ? 'button' : undefined"
    :aria-pressed="props.pressed"
  >
    <slot />
  </Primitive>
</template>
