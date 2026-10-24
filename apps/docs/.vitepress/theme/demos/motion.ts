import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

/** Whether the visitor asks for reduced motion, kept up to date; false until mounted. */
export function useReducedMotion(): Ref<boolean> {
  const reduced = ref(false)
  let query: MediaQueryList | undefined
  const onChange = (event: MediaQueryListEvent) => {
    reduced.value = event.matches
  }
  onMounted(() => {
    query = matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches
    query.addEventListener('change', onChange)
  })
  onBeforeUnmount(() => query?.removeEventListener('change', onChange))
  return reduced
}

/**
 * Calls `tick` every `every` milliseconds while `running` is true, in the browser only: a device's
 * clock, started and stopped with the device.
 */
export function useTicker(every: () => number, running: () => boolean, tick: () => void): void {
  const mounted = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined
  watch(() => mounted.value && running() && every(), (interval) => {
    clearInterval(timer)
    if (interval)
      timer = setInterval(tick, interval)
  })
  onMounted(() => {
    mounted.value = true
  })
  onBeforeUnmount(() => clearInterval(timer))
}
