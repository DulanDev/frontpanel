<script setup lang="ts">
import { FpButton, FpLed, FpMeter, FpSilk, FpSlider } from '@frontpanel/vue'
import { computed, reactive, ref } from 'vue'
import MiniDevice from './MiniDevice.vue'
import { useReducedMotion, useTicker } from './motion'
import { levelAt } from './player'

// A three-channel line mixer: each channel has a fader, mute and solo, and a meter that follows its
// made-up signal through the fader. Solo silences every channel not soloed; a channel driven into
// the red lights its peak lamp. Reduced motion holds the signal still.

const channels = reactive([
  { name: 'Vox', level: 72, mute: false, solo: false },
  { name: 'Gtr', level: 58, mute: false, solo: false },
  { name: 'Keys', level: 64, mute: false, solo: false },
])
/** Where the meters turn red and the peak lamps light. */
const PEAK = 90

const reducedMotion = useReducedMotion()
const ms = ref(250)
useTicker(() => 100, () => !reducedMotion.value, () => {
  ms.value += 100
})

const soloing = computed(() => channels.some(channel => channel.solo))
const levels = computed(() => channels.map((channel, index) => {
  if (channel.mute || (soloing.value && !channel.solo))
    return 0
  const signal = levelAt(ms.value + index * 777, index % 2 === 0 ? 0 : 1)
  return Math.min(100, Math.round(channel.level * 1.3 * signal))
}))
</script>

<template>
  <MiniDevice name="Line mixer">
    <div class="channels">
      <section v-for="(channel, index) in channels" :key="channel.name" class="channel fp-module" :aria-label="channel.name">
        <div class="peak">
          <FpLed color="red" :lit="levels[index]! >= PEAK" /> <FpSilk>Peak</FpSilk>
        </div>
        <div class="strip">
          <FpSlider v-model="channel.level" :label="channel.name" :value-text="v => `${v} percent`" class="fader" />
          <FpMeter :value="levels[index]" :red-at="PEAK" :segments="12" :aria-label="`${channel.name} level`" class="meter" />
        </div>
        <div class="keys">
          <FpButton :pressed="channel.mute" :aria-label="`Mute ${channel.name}`" @click="channel.mute = !channel.mute">
            M
          </FpButton>
          <FpButton :pressed="channel.solo" :aria-label="`Solo ${channel.name}`" @click="channel.solo = !channel.solo">
            S
          </FpButton>
        </div>
      </section>
    </div>
  </MiniDevice>
</template>

<style scoped>
.channels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.channel {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.375rem;
}

.peak {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 10px;
}

.strip {
  --fp-fader-length: 9rem;
  --fp-meter-length: 9rem;

  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
}

.keys {
  display: flex;
  gap: 0.25rem;
}

.keys > * {
  min-width: 2.25rem;
}
</style>
