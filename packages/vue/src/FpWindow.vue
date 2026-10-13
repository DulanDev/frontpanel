<script setup lang="ts">
// A window on the device: a matte module with a chrome title bar, docked wherever the caller puts it.
import { useId } from 'vue'
import FpButton from './FpButton.vue'
import FpIcon from './FpIcon.vue'

export interface FpWindowProps {
  /** The window's name, shown in the title bar; it also names the window for assistive tech. */
  title: string
  /** The title's heading level. */
  level?: 2 | 3 | 4 | 5 | 6
  /**
   * Adds a close button to the title bar, which emits `close`. Closing removes the focused button, so
   * move focus back to the control that opened the window.
   */
  closable?: boolean
  /** The close button's accessible name. Defaults to "Close" and the title. */
  closeLabel?: string
  /**
   * Wears the phone bottom sheet (`fp-sheet-panel`, in the opt-in page extra) instead of the module.
   * Position the sheet and choose when to use it yourself; wrap it in `<Transition name="fp-sheet">`.
   */
  sheet?: boolean
}

const props = withDefaults(defineProps<FpWindowProps>(), { level: 2 })

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  default?: () => unknown
  /** Extra title-bar buttons, set before the close button. */
  actions?: () => unknown
}>()

const titleId = useId()
</script>

<template>
  <section class="fp-window" :class="[props.sheet ? 'fp-sheet-panel' : 'fp-module']" :aria-labelledby="titleId">
    <div class="fp-module-title">
      <component :is="`h${props.level}`" :id="titleId" class="fp-silk fp-window-title">
        {{ props.title }}
      </component>
      <slot name="actions" />
      <FpButton v-if="props.closable" :aria-label="props.closeLabel ?? `Close ${props.title}`" @click="emit('close')">
        <FpIcon name="close" />
      </FpButton>
    </div>
    <div class="fp-window-body">
      <slot />
    </div>
  </section>
</template>
