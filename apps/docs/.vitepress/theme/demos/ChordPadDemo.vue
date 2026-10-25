<script setup lang="ts">
import { FpButton, FpCap, FpGelButton, FpIcon, FpKnob, FpLcd, FpLcdLine } from '@frontpanel/vue'
import { computed, ref } from 'vue'
import { chordsIn, keys as keyNames } from './devices'
import MiniDevice from './MiniDevice.vue'

// A chord pad: the six chords of a major key on caps, blue for major and amber for minor, with the
// key on a dial. Each chord tapped joins the progression along the bottom of the glass, its name
// in its own case, since Dm and DM are different chords. The gel button asks WhatsTheNextChord,
// the app this kit was made for, what could come next.

const APP = 'https://whatsthenextchord.com'
/** Chords the glass keeps in the progression, the oldest dropping off first. */
const KEEP = 4

const tonic = ref(0)
const chords = computed(() => chordsIn(tonic.value))
/** The progression, as places on the pad, so it follows the key when the dial turns. */
const progression = ref<number[]>([])
const last = computed(() => progression.value.at(-1))

const keyText = (index: number) => `Key of ${keyNames[index]}`

function tap(index: number) {
  progression.value = [...progression.value, index].slice(-KEEP)
}

const main = computed(() => last.value === undefined ? 'READY' : chords.value[last.value]!.name)
const trail = computed(() => progression.value.map(index => chords.value[index]!.name).join(' '))
</script>

<template>
  <MiniDevice name="Chord pad">
    <div class="head">
      <FpLcd class="lcd" aria-label="Display">
        <div class="row">
          <FpLcdLine :text="`KEY ${keyNames[tonic]}`" ghost :cells="6" class="small" />
          <FpLcdLine :text="last === undefined ? '' : chords[last]!.numeral" ghost :cells="3" class="small" />
        </div>
        <FpLcdLine :text="main" ghost :cells="6" class="main" />
        <FpLcdLine :text="trail" ghost :cells="15" class="small" />
      </FpLcd>
      <FpKnob v-model="tonic" :min="0" :max="11" label="Key" :value-text="keyText" />
    </div>

    <div class="pads" role="group" aria-label="Chords">
      <FpCap
        v-for="(chord, index) in chords"
        :key="chord.numeral"
        :color="chord.minor ? 'amber' : 'blue'"
        :aria-label="`${chord.name}, ${chord.numeral}`"
        @click="tap(index)"
      >
        {{ chord.name }}
      </FpCap>
    </div>

    <div class="foot">
      <FpButton :disabled="!progression.length" @click="progression = []">
        Clear
      </FpButton>
      <FpGelButton as="a" :href="APP" class="next">
        What's next? <FpIcon name="right" />
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

.pads {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.375rem;
}

.foot {
  display: flex;
  gap: 0.5rem;
}

.next {
  flex: 1;
  text-decoration: none;
}
</style>
