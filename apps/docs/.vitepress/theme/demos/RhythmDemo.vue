<script setup lang="ts">
import type { FpCapColor } from '@frontpanel/vue'
import { FpButton, FpCap, FpGelButton, FpIcon, FpKnob, FpLcd, FpLcdLine, FpLed, FpReadout, FpSilk } from '@frontpanel/vue'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { stepLength } from './devices'
import MiniDevice from './MiniDevice.vue'
import { useTicker } from './motion'

// A rhythm box: four voices, each with an eight-step pattern. A pad picks the voice the step keys
// show and set, and lights its lamp when it sounds; Play runs the steps at the tempo, the lamps over
// the keys marking the step. There is no audio.

const STEPS = 8
const voices: { short: string, name: string, color: FpCapColor, steps: boolean[] }[] = reactive([
  { short: 'BD', name: 'Kick', color: 'blue', steps: [true, false, false, false, true, false, true, false] },
  { short: 'SD', name: 'Snare', color: 'white', steps: [false, false, true, false, false, false, true, false] },
  { short: 'HH', name: 'Hat', color: 'amber', steps: [true, true, true, true, true, true, true, true] },
  { short: 'CP', name: 'Clap', color: 'berry', steps: [false, false, false, false, false, false, false, true] },
])
/** How long a tapped pad's lamp stays lit. */
const FLASH = 120

const voice = ref(0)
const selected = computed(() => voices[voice.value]!)
const tempo = ref(112)
const playing = ref(false)
/** The step that is sounding, or -1 when stopped. */
const step = ref(-1)

useTicker(() => stepLength(tempo.value), () => playing.value, () => {
  step.value = (step.value + 1) % STEPS
})

function togglePlay() {
  playing.value = !playing.value
  step.value = playing.value ? 0 : -1
}

const tapped = ref(-1)
let tapTimer: ReturnType<typeof setTimeout> | undefined
function pickVoice(index: number) {
  voice.value = index
  tapped.value = index
  clearTimeout(tapTimer)
  tapTimer = setTimeout(() => {
    tapped.value = -1
  }, FLASH)
}

onBeforeUnmount(() => clearTimeout(tapTimer))

const sounding = (index: number) => tapped.value === index || (step.value >= 0 && voices[index]!.steps[step.value]!)
</script>

<template>
  <MiniDevice name="Rhythm box">
    <template #lamps>
      <FpLed :lit="playing" label="Running" />
    </template>

    <div class="head">
      <FpLcd class="lcd">
        <FpLcdLine :text="selected.name.toUpperCase()" ghost :cells="5" class="voice" />
        <FpLcdLine :text="step >= 0 ? `STEP ${step + 1}` : 'STOP'" ghost :cells="6" class="small" />
      </FpLcd>
      <div class="tempo">
        <FpReadout :value="tempo" :digits="3" color="amber" aria-hidden="true" />
        <FpSilk>BPM</FpSilk>
      </div>
      <FpKnob v-model="tempo" :min="60" :max="180" label="Tempo" :value-text="v => `${v} beats per minute`" />
    </div>

    <div class="steps" role="group" :aria-label="`${selected.name} steps`">
      <div v-for="(on, index) in selected.steps" :key="index" class="step">
        <FpLed :lit="step === index" color="red" />
        <FpButton :pressed="on" :aria-label="`Step ${index + 1}`" @click="selected.steps[index] = !on">
          {{ index + 1 }}
        </FpButton>
      </div>
    </div>

    <div class="foot">
      <div class="pads" role="group" aria-label="Voice">
        <div v-for="(entry, index) in voices" :key="entry.short" class="pad">
          <FpLed :lit="sounding(index)" color="amber" />
          <FpCap :color="entry.color" :pressed="voice === index" :aria-label="entry.name" @click="pickVoice(index)">
            {{ entry.short }}
          </FpCap>
        </div>
      </div>
      <FpGelButton class="play" @click="togglePlay">
        <FpIcon v-if="!playing" name="play" /> {{ playing ? 'Stop' : 'Play' }}
      </FpGelButton>
    </div>
  </MiniDevice>
</template>

<style scoped>
.head {
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

.voice {
  font-size: 1.75rem;
  line-height: 1;
}

.small {
  font-size: 1rem;
  line-height: 1;
}

.tempo {
  --fp-readout-height: 2rem;

  display: grid;
  justify-items: center;
  gap: 0.25rem;
}

.steps {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.25rem;
}

.step,
.pad {
  display: grid;
  justify-items: center;
  gap: 0.25rem;
}

/* Eight keys across: narrower than a button's usual minimum, as on a step sequencer. */
.step > :deep(button) {
  width: 100%;
  min-width: 0;
  padding-inline: 0;
}

.foot {
  display: flex;
  align-items: end;
  gap: 0.5rem;
}

.pads {
  display: flex;
  gap: 0.375rem;
}

.pad > :deep(button) {
  min-width: 2.25rem;
}

.play {
  flex: 1;
}
</style>
