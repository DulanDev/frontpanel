<script setup lang="ts">
import type { FpCapColor } from '@frontpanel/vue'
import {
  FpButton,
  FpCap,
  FpDevice,
  FpGelButton,
  FpHousing,
  FpIcon,
  fpIconNames,
  FpLcd,
  FpLcdLine,
  FpLed,
  FpScrew,
  FpSilk,
  FpWell,
  FpWindow,
} from '@frontpanel/vue'
import { computed, ref } from 'vue'

// One small device built from the Vue components, drawn at 600 px and scaled to fit its column.
// It wears the page's skin, which follows the appearance toggle. The home page's hero turns the
// backdrop off, since the page stands on one already.

const { backdrop = true } = defineProps<{ backdrop?: boolean }>()

const tracks = ['CHROME HORIZON', 'GEL PRESSURE', 'SILKSCREEN', 'BACKLIGHT', 'TWO BLINKS', 'RIM LIGHT']
const track = ref(0)
const playing = ref(false)
const saves = ref(0)
const playlistOpen = ref(true)

const caps: { label: string, color: FpCapColor }[] = [
  { label: 'A', color: 'white' },
  { label: 'B', color: 'blue' },
  { label: 'C', color: 'amber' },
  { label: 'D', color: 'graphite' },
  { label: 'E', color: 'berry' },
]
const bank = ref('B')

const trackNumber = computed(() => String(track.value + 1).padStart(2, '0'))

function step(by: number) {
  track.value = (track.value + by + tracks.length) % tracks.length
}
</script>

<template>
  <FpDevice fit="width" :width="600" :backdrop class="deck" :class="{ framed: backdrop }">
    <div class="body">
      <header class="top">
        <FpScrew />
        <FpSilk as="h3" class="name">
          Deck · components
        </FpSilk>
        <FpHousing>
          <FpLed :lit="playing" /> PLAY
        </FpHousing>
        <FpHousing>
          <!-- Re-keyed on each save so the LED blinks twice again. -->
          <FpLed :key="saves" color="amber" :lit="saves > 0" blink /> SAVED
        </FpHousing>
        <FpScrew />
      </header>

      <!-- An extra control under the header: the home page's skin picker. -->
      <slot />

      <FpLcd class="lcd" aria-label="Display">
        <div class="lcd-row">
          <FpLcdLine :text="`TRACK ${trackNumber}`" ghost class="small" />
          <FpLcdLine :text="playing ? 'PLAY' : 'STOP'" ghost :cells="4" class="small" />
        </div>
        <FpLcdLine :text="tracks[track]!" redraw ghost :cells="14" class="large" aria-live="polite" />
      </FpLcd>

      <div class="row" role="group" aria-label="Transport">
        <FpButton aria-label="Previous track" @click="step(-1)">
          <FpIcon name="left" />
        </FpButton>
        <FpButton :pressed="playing" @click="playing = !playing">
          <FpIcon name="go" /> Play
        </FpButton>
        <FpButton aria-label="Next track" @click="step(1)">
          <FpIcon name="right" />
        </FpButton>
        <FpButton disabled>
          Eject
        </FpButton>
        <FpButton :pressed="playlistOpen" @click="playlistOpen = !playlistOpen">
          <FpIcon name="grid" /> List
        </FpButton>
        <FpGelButton class="save" @click="saves++">
          <FpIcon name="save" /> Save
        </FpGelButton>
      </div>

      <div class="row" role="group" aria-label="Bank">
        <FpCap
          v-for="cap in caps"
          :key="cap.label"
          :color="cap.color"
          :pressed="bank === cap.label"
          class="cap"
          @click="bank = cap.label"
        >
          {{ cap.label }}
        </FpCap>
      </div>

      <div class="windows">
        <FpWindow v-if="playlistOpen" title="Playlist" :level="4" closable class="playlist fp-scroll-thin" @close="playlistOpen = false">
          <FpWell as="ol" class="list">
            <li v-for="(name, index) in tracks" :key="name" :aria-current="index === track ? 'true' : undefined">
              {{ name }}
            </li>
          </FpWell>
        </FpWindow>
        <FpWell v-else class="empty">
          <FpSilk>Playlist closed</FpSilk>
        </FpWell>

        <FpWindow title="Icons" :level="4">
          <ul class="icons">
            <li v-for="name in fpIconNames" :key="name">
              <FpIcon :name="name" :label="name" />
            </li>
          </ul>
        </FpWindow>
      </div>
    </div>
  </FpDevice>
</template>

<style scoped>
.deck {
  color: var(--fp-color-ink);
}

.framed {
  padding: 1.5rem;
  border-radius: 12px;
}

.body {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.top,
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.name {
  margin: 0 auto 0 0;
  font-weight: 400;
}

.lcd {
  padding: 0.5rem 0.75rem;
}

.lcd-row {
  display: flex;
  justify-content: space-between;
}

.small {
  font-size: 1.25rem;
  line-height: 1;
}

.large {
  font-size: 2.75rem;
  line-height: 1;
}

.save {
  margin-inline-start: auto;
}

.cap {
  min-width: 3rem;
}

.windows {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  align-items: start;
}

.playlist {
  max-height: 11rem;
  overflow-y: auto;
}

.list {
  margin: 0;
  padding: 0.375rem 0.5rem 0.375rem 1.75rem;
  font-size: 13px;
}

.list [aria-current] {
  font-weight: 700;
}

.empty {
  display: grid;
  place-items: center;
  min-height: 6rem;
}

.icons {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-items: center;
}
</style>
