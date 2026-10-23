<script setup lang="ts">
// Chrome buttons joined into one bezel, as on a transport row. Name the group with `aria-label`.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export interface FpButtonGroupProps extends PrimitiveProps {}

const props = withDefaults(defineProps<FpButtonGroupProps>(), { as: 'div' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" class="fp-button-group" role="group">
    <slot />
  </Primitive>
</template>
