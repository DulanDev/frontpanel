<script setup lang="ts">
// An illuminated rocker. Reka's Switch supplies the behaviour and ARIA (a button with
// role="switch"); this adds the silkscreen label under it, as on the other units. Nothing else sits
// under it: a switch is always on or off, so a fault belongs on the device's readout or an LED, and
// a description goes in `aria-describedby`.
import type { FpLedColor } from './FpLed.vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'

export interface FpSwitchProps {
  /** A silkscreen label under the switch, which also names it. Without one, give it an `aria-label`. */
  label?: string
  /** The colour its lamp lights in. */
  color?: FpLedColor
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FpSwitchProps>(), { color: 'red' })

// Written out in full: Tailwind generates only the class names it finds in the source it scans.
const colorClass: Record<FpLedColor, string> = { green: 'fp-led-green', amber: 'fp-led-amber', red: 'fp-led-red' }

const model = defineModel<boolean>({ default: false })

const labelId = useId()

// Class and style place the switch and its label together; everything else (a name, a
// description, an id, a form value, listeners) belongs on the switch.
const attrs = useAttrs()
const unitAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const switchAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
</script>

<template>
  <div class="fp-unit" v-bind="unitAttrs">
    <SwitchRoot
      v-bind="switchAttrs"
      v-model="model"
      class="fp-switch"
      :class="colorClass[props.color]"
      :disabled="props.disabled"
      :aria-labelledby="props.label ? labelId : undefined"
    >
      <SwitchThumb class="fp-switch-rocker">
        <span class="fp-switch-lamp" />
        <span class="fp-switch-face" />
      </SwitchThumb>
    </SwitchRoot>
    <span v-if="props.label" :id="labelId" class="fp-silk">{{ props.label }}</span>
  </div>
</template>
