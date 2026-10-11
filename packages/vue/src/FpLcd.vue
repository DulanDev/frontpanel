<script setup lang="ts">
// A pane of LCD glass recessed into the chrome. Fill it with FpLcdLine, or any text in --fp-font-lcd.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'

export interface FpLcdProps extends PrimitiveProps {}

const props = withDefaults(defineProps<FpLcdProps>(), { as: 'div' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" class="fp-lcd">
    <slot />
  </Primitive>
</template>
