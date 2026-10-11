<script setup lang="ts">
// The glossy gel pill: the device's primary action, one per panel.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export interface FpGelButtonProps extends PrimitiveProps {}

const props = withDefaults(defineProps<FpGelButtonProps>(), { as: 'button' })
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    class="fp-gel"
    :type="props.as === 'button' && !props.asChild ? 'button' : undefined"
  >
    <slot />
  </Primitive>
</template>
