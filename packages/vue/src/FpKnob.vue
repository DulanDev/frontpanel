<script setup lang="ts">
// A rotary knob: a knurled chrome cap with a pointer mark, turned by dragging up and down or with
// the keys. Reka has no knob, so the slider behaviour is our own.
import { computed, useAttrs, useId } from 'vue'

export interface FpKnobProps {
  /** The lowest value, at the knob's 7 o'clock stop. */
  min?: number
  /** The highest value, at its 5 o'clock stop. */
  max?: number
  /** The step values snap to. PageUp and PageDown move ten steps. */
  step?: number
  /** A silkscreen label under the knob, which also names it. Without one, give it an `aria-label`. */
  label?: string
  /** Turns the value into the words a screen reader says, such as `v => `${v} dB``. */
  valueText?: (value: number) => string
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FpKnobProps>(), { min: 0, max: 100, step: 1 })

const emit = defineEmits<{
  /** The value when a drag ends, or after each key press. */
  valueCommit: [value: number]
}>()

const model = defineModel<number>({ default: 0 })

// Class and style place the knob and its label together; everything else (a name, an id,
// listeners) belongs on the slider itself.
const attrs = useAttrs()
const unitAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const knobAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const labelId = useId()

// The full sweep of a drag, in pixels, and how much Shift slows it.
const DRAG_RANGE = 200
const FINE = 0.1
const SWEEP = 270

const decimals = computed(() => (String(props.step).split('.')[1] ?? '').length)

function snap(value: number): number {
  const stepped = Math.round((value - props.min) / props.step) * props.step + props.min
  const clamped = Math.min(props.max, Math.max(props.min, stepped))
  return Number(clamped.toFixed(decimals.value))
}

const value = computed(() => snap(model.value))
const angle = computed(() => {
  const span = props.max - props.min
  const share = span > 0 ? (value.value - props.min) / span : 0
  return Math.round(share * SWEEP - SWEEP / 2)
})

function set(next: number): boolean {
  const snapped = snap(next)
  if (snapped === value.value)
    return false
  model.value = snapped
  return true
}

function onKeydown(event: KeyboardEvent): void {
  if (props.disabled)
    return
  const page = props.step * 10
  const moves: Record<string, number> = {
    ArrowUp: value.value + props.step,
    ArrowRight: value.value + props.step,
    ArrowDown: value.value - props.step,
    ArrowLeft: value.value - props.step,
    PageUp: value.value + page,
    PageDown: value.value - page,
    Home: props.min,
    End: props.max,
  }
  const next = moves[event.key]
  if (next === undefined)
    return
  event.preventDefault()
  if (set(next))
    emit('valueCommit', snap(next))
}

// A drag keeps its own unsnapped value, so small moves add up instead of rounding away.
let drag: { pointerId: number, y: number, raw: number, start: number } | undefined

function onPointerdown(event: PointerEvent): void {
  if (props.disabled || event.button !== 0)
    return
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture?.(event.pointerId)
  // A script focus would light the ring as if from the keyboard; a press should not.
  target.focus({ preventScroll: true, focusVisible: false })
  drag = { pointerId: event.pointerId, y: event.clientY, raw: value.value, start: value.value }
}

function onPointermove(event: PointerEvent): void {
  if (!drag || event.pointerId !== drag.pointerId)
    return
  const rate = (props.max - props.min) / DRAG_RANGE * (event.shiftKey ? FINE : 1)
  drag.raw = Math.min(props.max, Math.max(props.min, drag.raw + (drag.y - event.clientY) * rate))
  drag.y = event.clientY
  set(drag.raw)
}

function onPointerup(event: PointerEvent): void {
  if (!drag || event.pointerId !== drag.pointerId)
    return
  const committed = snap(drag.raw)
  const moved = committed !== drag.start
  drag = undefined
  if (moved)
    emit('valueCommit', committed)
}
</script>

<template>
  <div class="fp-knob-unit" v-bind="unitAttrs">
    <div
      v-bind="knobAttrs"
      class="fp-knob"
      role="slider"
      :tabindex="props.disabled ? undefined : 0"
      :aria-valuemin="props.min"
      :aria-valuemax="props.max"
      :aria-valuenow="value"
      :aria-valuetext="props.valueText?.(value)"
      :aria-labelledby="props.label ? labelId : undefined"
      :aria-disabled="props.disabled || undefined"
      @keydown="onKeydown"
      @pointerdown="onPointerdown"
      @pointermove="onPointermove"
      @pointerup="onPointerup"
      @pointercancel="onPointerup"
    >
      <span class="fp-knob-mark" :style="{ rotate: `${angle}deg` }" />
    </div>
    <span v-if="props.label" :id="labelId" class="fp-silk">{{ props.label }}</span>
  </div>
</template>
