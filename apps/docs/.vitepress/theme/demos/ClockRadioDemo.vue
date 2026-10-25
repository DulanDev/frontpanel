<script setup lang="ts">
import { FpGelButton, FpHousing, FpKnob, FpLcd, FpLcdLine, FpLed, FpReadout, FpSwitch } from '@frontpanel/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { clockFace, stationAt } from './devices'
import MiniDevice from './MiniDevice.vue'
import { useTicker } from './motion'

// A clock radio: the visitor's own time in red digits, an FM dial that finds four made-up
// stations, and an alarm. With the alarm set, Snooze names itself on the glass for a moment.

const ALARM = '7:00'
/** How long the glass shows the snooze. */
const NOTICE = 1500

// Unknown until the page runs in a browser, so the digits stay dark when prerendered.
const now = ref<Date>()
onMounted(() => {
  now.value = new Date()
})
useTicker(() => 1000, () => true, () => {
  now.value = new Date()
})
const face = computed(() => now.value ? clockFace(now.value) : undefined)

const frequency = ref(101.1)
const station = computed(() => stationAt(frequency.value))
const alarm = ref(false)

const snoozing = ref(false)
let snoozeTimer: ReturnType<typeof setTimeout> | undefined
function snooze() {
  snoozing.value = true
  clearTimeout(snoozeTimer)
  snoozeTimer = setTimeout(() => {
    snoozing.value = false
  }, NOTICE)
}
onBeforeUnmount(() => clearTimeout(snoozeTimer))

const lines = computed(() => {
  if (snoozing.value)
    return { top: 'SNOOZE', main: '9 MIN' }
  return { top: alarm.value ? `AL ${ALARM}` : '', main: station.value ?? '' }
})
</script>

<template>
  <MiniDevice name="Clock radio">
    <template #lamps>
      <FpHousing class="lamp">
        <FpLed color="amber" :lit="face?.pm" /> PM
      </FpHousing>
    </template>

    <FpReadout :value="face?.time ?? ''" :digits="4" color="red" class="time" :value-text="v => v ? `The time is ${v} ${face?.pm ? 'PM' : 'AM'}` : 'The time'" />

    <div class="tuner">
      <FpLcd class="lcd" aria-label="Radio display">
        <div class="row">
          <FpLcdLine :text="`FM ${frequency.toFixed(1)}`" ghost :cells="8" class="small" />
          <FpLcdLine :text="lines.top" ghost :cells="7" class="small" />
        </div>
        <FpLcdLine :text="lines.main" ghost :cells="10" class="main" />
      </FpLcd>
      <FpKnob v-model="frequency" :min="87.5" :max="108" :step="0.1" label="Tuning" :value-text="v => `${v.toFixed(1)} megahertz`" />
    </div>

    <div class="foot">
      <FpHousing class="lamp">
        <FpLed :lit="!!station" /> STEREO
      </FpHousing>
      <FpSwitch v-model="alarm" label="Alarm" label-placement="start" orientation="horizontal" color="amber" />
      <FpGelButton class="snooze" :disabled="!alarm" @click="snooze">
        Snooze
      </FpGelButton>
    </div>
    <span role="status" class="sr-only">{{ snoozing ? 'Snoozing for 9 minutes' : '' }}</span>
  </MiniDevice>
</template>

<style scoped>
.time {
  --fp-readout-height: 4.5rem;

  justify-self: center;
}

.tuner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.lcd {
  flex: 1;
  display: grid;
  gap: 0.125rem;
  padding: 0.375rem 0.625rem;
}

.row {
  display: flex;
  justify-content: space-between;
}

.small {
  font-size: 1rem;
  line-height: 1;
}

.main {
  font-size: 1.75rem;
  line-height: 1;
}

.lamp {
  font-size: 10px;
}

.foot {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.snooze {
  flex: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
