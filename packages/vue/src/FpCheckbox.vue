<script setup lang="ts">
// One piano key that latches on its own, in its own well: press it to latch it down, press it again
// to let it up. Reka's Checkbox supplies the behaviour and ARIA (a button with role="checkbox");
// this adds the label printed over the key. For a row of them in one well, use FpCheckboxGroup.
import type { FpLedColor } from './FpLed.vue'
import type { FpKeyLed } from './keys'
import { CheckboxRoot } from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'
import { ledColorClass } from './keys'

export interface FpCheckboxProps {
  /** A silkscreen label over the key, which also names it. Without one, give it an `aria-label`. */
  label?: string
  /** Standing up, or on its side with the label before it. */
  orientation?: 'vertical' | 'horizontal'
  /** Where the light is: the strip at the foot of the key, an LED over the label, or none. */
  led?: FpKeyLed
  /** The colour its LED lights in. */
  color?: FpLedColor
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FpCheckboxProps>(), { orientation: 'horizontal', led: 'strip', color: 'green' })

const model = defineModel<boolean>({ default: false })

const labelId = useId()

// Class and style place the key and its label together; everything else (a name, a description,
// an id, a form value, listeners) belongs on the key.
const attrs = useAttrs()
const rowAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const keyAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
</script>

<template>
  <div class="fp-keys" :data-orientation="props.orientation" v-bind="rowAttrs">
    <span v-if="props.label" :id="labelId" class="fp-silk">
      <span
        v-if="props.led === 'above'"
        class="fp-led"
        :class="[ledColorClass[props.color], { 'fp-led-lit': model }]"
        aria-hidden="true"
      />{{ props.label }}
    </span>
    <CheckboxRoot
      v-bind="keyAttrs"
      v-model="model"
      class="fp-key"
      :class="props.led === 'strip' ? ledColorClass[props.color] : undefined"
      :data-strip="props.led === 'strip' ? undefined : 'plain'"
      :disabled="props.disabled"
      :aria-labelledby="props.label ? labelId : undefined"
    />
  </div>
</template>
