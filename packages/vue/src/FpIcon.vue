<script setup lang="ts">
// A 16 px pixel icon. Decorative by default: the label usually lives on the button it sits in.
import type { FpIconName } from './icons'
import { computed } from 'vue'
import { fpIconPaths } from './icons'

export interface FpIconProps {
  name: FpIconName
  /** Announces the icon as an image with this name, for an icon that stands alone. */
  label?: string
}

const props = defineProps<FpIconProps>()

const d = computed(() => fpIconPaths[props.name])
</script>

<template>
  <svg
    viewBox="0 0 16 16"
    class="fp-icon"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label || undefined"
    :aria-hidden="props.label ? undefined : 'true'"
  >
    <path :d="d" />
  </svg>
</template>
