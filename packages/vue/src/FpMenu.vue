<script setup lang="ts">
// A faceplate menu: a brushed-chrome plate that drops from the button in its trigger slot. Reka's
// DropdownMenu supplies the behaviour and ARIA (the menu button, arrow keys, type-ahead, Escape).
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import { onMounted, ref, useAttrs, watch } from 'vue'

export interface FpMenuProps {
  /** The side of the trigger the plate drops on. It flips to the other side when there is no room. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** How the plate lines up with the trigger along that side. */
  align?: 'start' | 'center' | 'end'
  /**
   * Shuts out the rest of the page while the menu is open: pointer events and scrolling outside it
   * are blocked, and assistive tech reads only the menu.
   */
  modal?: boolean
  /**
   * Where the plate is mounted, a selector or an element. It takes the skin of the nearest
   * `data-fp-skin` around the trigger with it; a custom skin set on another selector needs `to`
   * inside that element.
   */
  to?: string | HTMLElement
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FpMenuProps>(), { side: 'bottom', align: 'start', modal: true, to: 'body' })

defineSlots<{
  /**
   * The button that opens the menu, such as an `FpButton`. It gets `aria-haspopup` and
   * `aria-expanded`, which hold a chrome button down while the menu is open.
   */
  trigger?: (props: { open: boolean }) => unknown
  /** The menu's rows: `FpMenuItem` and `FpMenuSeparator`. */
  default?: () => unknown
}>()

const open = defineModel<boolean>('open', { default: false })

// Class, style and any other attribute go on the plate.
const attrs = useAttrs()

// The plate is mounted away from the trigger, outside any skin set around the device, so it
// carries the trigger's skin with it.
const trigger = ref<{ $el: Node }>()
const skin = ref<string>()
function readSkin() {
  const el = trigger.value?.$el
  skin.value = el instanceof Element ? el.closest('[data-fp-skin]')?.getAttribute('data-fp-skin') ?? undefined : undefined
}
watch(open, (isOpen) => {
  if (isOpen)
    readSkin()
})
onMounted(() => {
  if (open.value)
    readSkin()
})
</script>

<template>
  <DropdownMenuRoot v-model:open="open" :modal="props.modal">
    <DropdownMenuTrigger ref="trigger" as-child>
      <slot name="trigger" :open="open" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal :to="props.to">
      <DropdownMenuContent
        v-bind="attrs"
        class="fp-menu"
        :data-fp-skin="skin"
        :side="props.side"
        :align="props.align"
        :side-offset="4"
        :collision-padding="8"
        :style="{ maxHeight: 'var(--reka-dropdown-menu-content-available-height)' }"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
