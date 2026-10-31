<script setup lang="ts">
// A row of latching piano keys: pressing one latches it down and lets the last one up. Reka's
// RadioGroup supplies the behaviour and ARIA (a radiogroup of radio buttons, arrows to move the
// latch along the row); this adds the labels printed over the keys and the group's label under
// them. Reka writes the orientation onto the group as `data-orientation`, which lays the keys out.
import type { FpLedColor } from './FpLed.vue'
import type { FpKeyLed, FpKeyOption } from './keys'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'
import { ledColorClass } from './keys'

export interface FpRadioGroupProps {
  /** The keys, left to right or top to bottom. */
  options: FpKeyOption[]
  /** A silkscreen label under the keys, which also names the group. Without one, give it an `aria-label`. */
  label?: string
  /** Keys standing side by side, or on their side and stacked. */
  orientation?: 'vertical' | 'horizontal'
  /** Where the light is: the strip at the foot of each key, an LED over each label, or none. */
  led?: FpKeyLed
  /** The colour the LEDs light in, unless an option sets its own. */
  color?: FpLedColor
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FpRadioGroupProps>(), { orientation: 'horizontal', led: 'strip', color: 'green' })

const model = defineModel<string>()

const id = useId()
const labelId = `${id}-label`
const keyLabelId = (index: number) => `${id}-key-${index}`

const colorOf = (option: FpKeyOption) => ledColorClass[option.color ?? props.color]

// Class and style place the group and its label together; everything else (a name, a form name,
// an id, listeners) belongs on the group.
const attrs = useAttrs()
const unitAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const groupAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
</script>

<template>
  <div class="fp-unit" v-bind="unitAttrs">
    <RadioGroupRoot
      v-bind="groupAttrs"
      v-model="model"
      class="fp-keys"
      :orientation="props.orientation"
      :disabled="props.disabled"
      :aria-labelledby="props.label ? labelId : undefined"
    >
      <template v-for="(option, index) in props.options" :key="option.value">
        <span :id="keyLabelId(index)" class="fp-silk">
          <span
            v-if="props.led === 'above'"
            class="fp-led"
            :class="[colorOf(option), { 'fp-led-lit': model === option.value }]"
            aria-hidden="true"
          />{{ option.label }}
        </span>
        <RadioGroupItem
          :value="option.value"
          :disabled="option.disabled"
          class="fp-key"
          :class="props.led === 'strip' ? colorOf(option) : undefined"
          :data-strip="props.led === 'strip' ? undefined : 'plain'"
          :aria-labelledby="keyLabelId(index)"
        />
      </template>
    </RadioGroupRoot>
    <span v-if="props.label" :id="labelId" class="fp-silk">{{ props.label }}</span>
  </div>
</template>
