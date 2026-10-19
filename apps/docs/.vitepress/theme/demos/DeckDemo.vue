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
import { useData } from 'vitepress'
import { computed, onBeforeUnmount, ref } from 'vue'

// One small device built from the Vue components, drawn at 600 px and scaled to fit its column.
// It wears the page's skin, which follows the appearance toggle. The home page's hero turns the
// backdrop off, since the page stands on one already, and gives it a SKIN button.

const { backdrop = true, skinButton = false } = defineProps<{ backdrop?: boolean, skinButton?: boolean }>()

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

// The SKIN button steps the page's skin (VitePress's isDark, which the theme turns into
// data-fp-skin) and borrows the LCD to name it for a moment, as a player shows a setting it has
// just changed, then goes back to the track.
const skinNames = {
  silver: { lcd: 'SILVER', full: 'Chrome Silver' },
  gunmetal: { lcd: 'GUNMETAL', full: 'Gunmetal Night' },
} as const
const { isDark } = useData()
/** The skin the LCD names while it shows one. */
const shownSkin = ref<keyof typeof skinNames>()
/** Said once a skin is stepped to, never on load. */
const skinStatus = ref('')
let skinTimer: ReturnType<typeof setTimeout> | undefined

function nextSkin() {
  isDark.value = !isDark.value
  const skin = isDark.value ? 'gunmetal' : 'silver'
  shownSkin.value = skin
  skinStatus.value = `Skin: ${skinNames[skin].full}`
  clearTimeout(skinTimer)
  skinTimer = setTimeout(() => {
    shownSkin.value = undefined
  }, 1500)
}

onBeforeUnmount(() => clearTimeout(skinTimer))
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

      <FpLcd class="lcd" aria-label="Display">
        <div class="lcd-row">
          <FpLcdLine :text="shownSkin ? 'SKIN' : `TRACK ${trackNumber}`" ghost :cells="8" class="small" />
          <FpLcdLine :text="playing ? 'PLAY' : 'STOP'" ghost :cells="4" class="small" />
        </div>
        <!--
          A skin's name stands in for the track for a moment. The status line says it, so the
          glass stays quiet, and the track's live region comes back without repeating itself.
        -->
        <FpLcdLine v-if="shownSkin" :text="skinNames[shownSkin].lcd" redraw ghost :cells="14" class="large" aria-hidden="true" />
        <FpLcdLine v-else :text="tracks[track]!" redraw ghost :cells="14" class="large" aria-live="polite" />
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
        <FpButton v-if="skinButton" @click="nextSkin">
          Skin
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
    <span v-if="skinButton" class="sr-only" role="status">{{ skinStatus }}</span>
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

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
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
