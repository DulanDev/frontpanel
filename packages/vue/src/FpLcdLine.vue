<script setup lang="ts">
// One line of LCD text, optionally with its unlit segments showing behind it.
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

export interface FpLcdLineProps extends PrimitiveProps {
  /** The text on the glass. Readouts read best in capitals. */
  text: string
  /** Shows the unlit segments behind the text, as on real glass. */
  ghost?: boolean
  /** The line's width in character cells, which the ghost segments fill. Defaults to the text's length. */
  cells?: number
  /** Redraws the line left to right whenever its text changes, as a display does. */
  redraw?: boolean
}

const props = withDefaults(defineProps<FpLcdLineProps>(), { as: 'p' })

const ghostText = computed(() => '8'.repeat(props.cells ?? props.text.length))
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" class="fp-lcd-line">
    <span v-if="props.ghost" class="fp-lcd-ghost" aria-hidden="true">{{ ghostText }}</span>
    <!-- Keyed on the text so a new value mounts afresh and the sweep plays again. -->
    <span v-if="props.redraw" :key="props.text" class="fp-lcd-redraw">{{ props.text }}</span>
    <span v-else>{{ props.text }}</span>
  </Primitive>
</template>
