<script setup lang="ts">
// Dark housing that LEDs and small readouts sit in.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export interface FpHousingProps extends PrimitiveProps {}

const props = withDefaults(defineProps<FpHousingProps>(), { as: 'span' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" class="fp-housing">
    <slot />
  </Primitive>
</template>
