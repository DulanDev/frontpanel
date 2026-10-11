<script setup lang="ts">
// The device: a molded body in a liquid-chrome rim, on a quiet backdrop. Its modules go in the body.
import type { CSSProperties } from 'vue'
import type { FpDeviceFit, Size } from './fit'
import { computed, shallowRef, useTemplateRef, warn, watch } from 'vue'
import { fitScale } from './fit'

export interface FpDeviceProps {
  /** Sets the device on the gridded backdrop. Turn it off when the page already provides one. */
  backdrop?: boolean
  /** Rings the body in liquid chrome. Without it the body runs to the edges, as on a phone. */
  rim?: boolean
  /**
   * Scale-to-fit. `none` leaves layout to the page: the device fills its box and its modules reflow
   * at your breakpoints. `width` draws the device at its design `width` and scales it to the width it
   * has; `contain` scales it to fit both sides, which needs a box with a height of its own.
   */
  fit?: FpDeviceFit
  /** The design width in px, which scale-to-fit needs. */
  width?: number
  /** A fixed design height in px. Without it the device is as tall as its contents. */
  height?: number
  /** The largest scale to-fit may reach. 1 keeps the device from growing past its design size. */
  maxScale?: number
}

const props = withDefaults(defineProps<FpDeviceProps>(), {
  backdrop: true,
  rim: true,
  fit: 'none',
  maxScale: 1,
})

const stage = useTemplateRef<HTMLElement>('stage')
const device = useTemplateRef<HTMLElement>('device')

const room = shallowRef<Size>({ width: 0, height: 0 })
const naturalHeight = shallowRef(0)

const fitting = computed(() => {
  if (props.fit === 'none')
    return false
  if (props.width === undefined) {
    warn(`FpDevice: fit="${props.fit}" needs a design width; the device is not scaled.`)
    return false
  }
  return true
})

const designHeight = computed(() => props.height ?? naturalHeight.value)

const scale = computed(() => {
  if (!fitting.value || props.fit === 'none')
    return null
  return fitScale(props.fit, room.value, { width: props.width!, height: designHeight.value }, props.maxScale)
})

/** The room inside the stage's padding, and the device's height before scaling (transforms do not change it). */
function measure(): void {
  if (!stage.value || !device.value)
    return
  const style = getComputedStyle(stage.value)
  const px = (value: string) => Number.parseFloat(value) || 0
  room.value = {
    width: stage.value.clientWidth - px(style.paddingLeft) - px(style.paddingRight),
    height: stage.value.clientHeight - px(style.paddingTop) - px(style.paddingBottom),
  }
  naturalHeight.value = device.value.offsetHeight
}

watch([fitting, stage, device], ([on, stageElement, deviceElement], _, onCleanup) => {
  if (!on || !stageElement || !deviceElement || typeof ResizeObserver === 'undefined')
    return
  const observer = new ResizeObserver(measure)
  observer.observe(stageElement)
  observer.observe(deviceElement)
  onCleanup(() => observer.disconnect())
}, { flush: 'post', immediate: true })

/** Reserves the scaled size, so the page flows around the device as it looks. */
const boxStyle = computed<CSSProperties | undefined>(() => {
  if (!fitting.value)
    return { display: 'contents' }
  if (scale.value === null)
    return undefined
  return {
    width: `${props.width! * scale.value}px`,
    height: `${designHeight.value * scale.value}px`,
    marginInline: 'auto',
  }
})

const deviceStyle = computed<CSSProperties | undefined>(() => {
  if (!fitting.value)
    return undefined
  return {
    width: `${props.width}px`,
    height: props.height === undefined ? undefined : `${props.height}px`,
    scale: scale.value ?? undefined,
    transformOrigin: '0 0',
    // Drawn at full size, then scaled before the first paint; hidden until there is a scale.
    visibility: scale.value === null ? 'hidden' : undefined,
  }
})
</script>

<template>
  <div ref="stage" :class="{ 'fp-device-backdrop': props.backdrop }">
    <div :style="boxStyle">
      <div v-if="props.rim" ref="device" class="fp-device-rim" :style="deviceStyle">
        <div class="fp-device-body">
          <slot />
        </div>
      </div>
      <div v-else ref="device" class="fp-device-body" :style="deviceStyle">
        <slot />
      </div>
    </div>
  </div>
</template>
