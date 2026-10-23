<script setup lang="ts">
// A row on an FpMenu. Choosing it, with the pointer or with Enter or Space, emits `select` and
// closes the menu.
import type { PrimitiveProps } from 'reka-ui'
import { DropdownMenuItem } from 'reka-ui'

export interface FpMenuItemProps extends PrimitiveProps {
  /** Greys the row out; it can't be chosen. */
  disabled?: boolean
  /** The text type-ahead matches, when the row's own text is not what a user would type. */
  textValue?: string
}

const props = withDefaults(defineProps<FpMenuItemProps>(), { as: 'div' })

const emit = defineEmits<{
  /** The row was chosen. Call `preventDefault()` on the event to keep the menu open. */
  select: [event: Event]
}>()
</script>

<template>
  <DropdownMenuItem
    :as="props.as"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :text-value="props.textValue"
    class="fp-menu-item"
    @select="emit('select', $event)"
  >
    <slot />
  </DropdownMenuItem>
</template>
