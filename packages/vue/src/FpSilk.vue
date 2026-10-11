<script setup lang="ts">
// A silkscreened hardware label. Render it as a heading or label element where it names something.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export interface FpSilkProps extends PrimitiveProps {}

const props = withDefaults(defineProps<FpSilkProps>(), { as: 'span' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" class="fp-silk">
    <slot />
  </Primitive>
</template>
