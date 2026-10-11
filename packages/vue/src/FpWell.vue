<script setup lang="ts">
// A recessed well inside a matte panel, for secondary content or an empty slot.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export interface FpWellProps extends PrimitiveProps {}

const props = withDefaults(defineProps<FpWellProps>(), { as: 'div' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" class="fp-well">
    <slot />
  </Primitive>
</template>
