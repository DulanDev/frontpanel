<script setup lang="ts">
// A fader: a chrome cap that slides along a recessed slot. Reka's Slider supplies the behaviour and
// ARIA; this keeps its value a single number and matches FpKnob's API.
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed, useAttrs, useId, useTemplateRef } from 'vue'

export interface FpSliderProps {
  /** The lowest value, at the bottom (or the start, lying on its side). */
  min?: number
  /** The highest value, at the top (or the end). */
  max?: number
  /** The step values snap to. PageUp, PageDown and Shift with an arrow move ten steps. */
  step?: number
  /** Stands up, like a mixer channel, or lies on its side. */
  orientation?: 'vertical' | 'horizontal'
  /** A silkscreen label under the fader, which also names it. Without one, give it an `aria-label`. */
  label?: string
  /** Turns the value into the words a screen reader says, such as `v => `${v} dB``. */
  valueText?: (value: number) => string
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FpSliderProps>(), { min: 0, max: 100, step: 1, orientation: 'vertical' })

const emit = defineEmits<{
  /** The value when a drag ends, or after each key press. */
  valueCommit: [value: number]
}>()

const model = defineModel<number>({ default: 0 })

// Class and style place the fader and its label together; everything else (a name, an id,
// listeners) belongs on the cap, which is the slider.
const attrs = useAttrs()
const unitAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const capAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const labelId = useId()

// Reka holds a list of values, one per thumb; a fader has one.
const values = computed(() => [model.value])

function onUpdate(next: number[] | undefined): void {
  if (next?.[0] !== undefined)
    model.value = next[0]
}

// Reka focuses the cap from script when it is pressed, which lights the ring as if from the keyboard.
// Focusing it first, without the ring, turns Reka's call into a no-op.
const unit = useTemplateRef<HTMLElement>('unit')

function onPress(event: PointerEvent): void {
  if (props.disabled || event.button !== 0)
    return
  unit.value?.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true, focusVisible: false })
}

function onCommit(next: number[]): void {
  if (next[0] !== undefined)
    emit('valueCommit', next[0])
}
</script>

<template>
  <div ref="unit" class="fp-fader-unit" v-bind="unitAttrs" @pointerdown.capture="onPress">
    <SliderRoot
      class="fp-fader"
      :model-value="values"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :orientation="props.orientation"
      :disabled="props.disabled"
      @update:model-value="onUpdate"
      @value-commit="onCommit"
    >
      <SliderTrack class="fp-fader-slot" />
      <SliderThumb
        v-bind="capAttrs"
        class="fp-fader-cap"
        :aria-valuetext="props.valueText?.(model)"
        :aria-labelledby="props.label ? labelId : undefined"
        :aria-disabled="props.disabled || undefined"
      />
    </SliderRoot>
    <span v-if="props.label" :id="labelId" class="fp-silk">{{ props.label }}</span>
  </div>
</template>
