<script setup lang="ts">
// A level meter: a column of LED segments that light green, then amber, then red. Reka has no
// meter, so this is our own, on `role="meter"`.
import type { FpLens } from './lens'
import { computed, useAttrs, useId } from 'vue'
import { lensClass } from './lens'

export interface FpMeterProps {
  /** The level to show. Values past the ends light all or none of it. */
  value?: number
  /** The level at the bottom (or the start, lying on its side). */
  min?: number
  /** The level at the top (or the end). */
  max?: number
  /** How many LED segments it has. A segment lights once the value reaches it. */
  segments?: number
  /** Where amber begins, in the value's units. Defaults to 70 percent of the range. */
  amberAt?: number
  /** Where red begins, in the value's units. Defaults to 90 percent of the range. */
  redAt?: number
  /** Stands up, like a channel's level, or lies on its side. */
  orientation?: 'vertical' | 'horizontal'
  /** How its segments light. Unset, it takes the lens set around it (`fp-lens-*`), else diffused. */
  lens?: FpLens
  /** A silkscreen label under the meter, which also names it. Without one, give it an `aria-label`. */
  label?: string
  /** Turns the value into the words a screen reader says, such as `v => `${v} dB``. */
  valueText?: (value: number) => string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FpMeterProps>(), { value: 0, min: 0, max: 100, segments: 12, orientation: 'vertical' })

// Class and style place the meter and its label together; everything else (a name, an id) belongs
// on the meter itself.
const attrs = useAttrs()
const unitAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const meterAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const labelId = useId()

const clamped = computed(() => Math.min(props.max, Math.max(props.min, props.value)))

// A level's share of the range, in whole segments: rounded down for the value, so a segment lights
// only once it is reached, and to the nearest edge for a zone.
function share(value: number): number {
  const span = props.max - props.min
  return span > 0 ? Math.min(1, Math.max(0, (value - props.min) / span)) : 0
}

function segmentsTo(value: number, round: (n: number) => number): number {
  // A small allowance keeps 0.1 * 10 segments from landing a hair under 1.
  return round(share(value) * props.segments + 1e-9) / props.segments
}

const meterStyle = computed(() => {
  const span = props.max - props.min
  return {
    '--fp-meter-level': String(segmentsTo(clamped.value, Math.floor)),
    '--fp-meter-segments': String(props.segments),
    '--fp-meter-amber': String(segmentsTo(props.amberAt ?? props.min + span * 0.7, Math.round)),
    '--fp-meter-red': String(segmentsTo(props.redAt ?? props.min + span * 0.9, Math.round)),
  }
})
</script>

<template>
  <div class="fp-unit" v-bind="unitAttrs">
    <div
      v-bind="meterAttrs"
      class="fp-meter"
      :class="props.lens && lensClass[props.lens]"
      role="meter"
      :data-orientation="props.orientation"
      :aria-valuemin="props.min"
      :aria-valuemax="props.max"
      :aria-valuenow="clamped"
      :aria-valuetext="props.valueText?.(clamped)"
      :aria-labelledby="props.label ? labelId : undefined"
      :style="meterStyle"
    />
    <span v-if="props.label" :id="labelId" class="fp-silk">{{ props.label }}</span>
  </div>
</template>
