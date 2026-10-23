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
  FpKnob,
  FpLcd,
  FpLcdLine,
  FpLed,
  FpMeter,
  FpReadout,
  FpScrew,
  FpSilk,
  FpSlider,
  FpSwitch,
  FpWell,
  FpWindow,
} from '@frontpanel/vue'
import { useData } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { clock, levelAt, marqueeFrame } from './player'

// A desk media player built from the Vue components, drawn at 600 px and scaled to fit its column.
// Every control does what it would on the device: power-on lights every segment for a moment, Play
// runs the counter and moves the meters, a long title steps across the glass, and the caps pick an
// EQ preset. It wears the page's skin, which follows the appearance toggle. In the home page's hero
// it drops its backdrop, since the page stands on one already, gains a Skin button, and shows a
// levels window in place of the icons.

const { hero = false } = defineProps<{ hero?: boolean }>()

const tracks = [
  { title: 'Chrome Horizon', length: 192 },
  { title: 'Gel Pressure', length: 167 },
  { title: 'Silkscreen', length: 214 },
  { title: 'Backlight at Midnight', length: 238 },
  { title: 'Two Blinks', length: 145 },
  { title: 'Rim Light (Extended Mix)', length: 301 },
]
/** The title line's width in cells; a longer title steps across it. */
const TITLE_CELLS = 14
/** Milliseconds per tick of the clock that runs play, the meters and the title. */
const TICK = 100
/** Milliseconds a long title rests on each cell. */
const SCROLL = 300
/** How long the display shows a setting it has just changed, and how long the start-up check lasts. */
const NOTICE = 1500
const BOOT = 900

const track = ref(0)
const playing = ref(false)
/** How far into the track play has run, in milliseconds. */
const playMs = ref(0)
const saves = ref(0)
const playlistOpen = ref(true)
const gain = ref(64)
const volume = ref(70)

const current = computed(() => tracks[track.value]!)
const trackNumber = computed(() => String(track.value + 1).padStart(2, '0'))

/** What the status line says once a track, preset or skin changes; never on load. */
const status = ref('')

// Reduced motion keeps every state and drops the movement: the meters hold the gain and a long
// title stays on its start. The counter still counts.
const reducedMotion = ref(false)
let motionQuery: MediaQueryList | undefined
function onMotion(event: MediaQueryListEvent) {
  reducedMotion.value = event.matches
}
onMounted(() => {
  motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotion)
})

// The rocker powers the deck. On, it lights every segment and LED for a moment, as a device checks
// its display, then settles. Off, the glass shows only its ghost segments, the LEDs, meters and
// readout go dark, play stops and the controls wait. The fader and knob still turn, as pots do.
const power = ref(true)
const booting = ref(false)
const ready = computed(() => power.value && !booting.value)
let bootTimer: ReturnType<typeof setTimeout> | undefined

// A setting the display names for a moment after it changes, in place of the track, as a player
// shows a setting it has just changed.
const notice = ref<{ tag: string, text: string }>()
let noticeTimer: ReturnType<typeof setTimeout> | undefined

function showNotice(tag: string, text: string, said: string) {
  status.value = said
  clearTimeout(noticeTimer)
  if (!ready.value)
    return
  notice.value = { tag, text }
  noticeTimer = setTimeout(() => {
    notice.value = undefined
  }, NOTICE)
}

watch(power, (on) => {
  clearTimeout(bootTimer)
  clearTimeout(noticeTimer)
  notice.value = undefined
  playing.value = false
  playMs.value = 0
  booting.value = on
  if (on) {
    bootTimer = setTimeout(() => {
      booting.value = false
    }, BOOT)
  }
})

// One clock runs play: the counter, the meters and a long title all follow playMs.
let clockTimer: ReturnType<typeof setInterval> | undefined
watch(() => playing.value && ready.value, (running) => {
  clearInterval(clockTimer)
  if (running)
    clockTimer = setInterval(tick, TICK)
})

function tick() {
  playMs.value += TICK
  if (playMs.value >= current.value.length * 1000)
    step(1)
}

// Back in the first few seconds goes to the track before; later, to the start of this one.
function step(by: number) {
  if (by < 0 && playMs.value >= 3000) {
    playMs.value = 0
    return
  }
  track.value = (track.value + by + tracks.length) % tracks.length
  playMs.value = 0
}

watch(track, () => {
  status.value = `Track ${trackNumber.value}: ${current.value.title}`
})

// The title steps across the glass while it plays, and holds where it is when stopped.
const title = computed(() => current.value.title.toUpperCase())
const scrolling = computed(() => ready.value && playing.value && !reducedMotion.value && title.value.length > TITLE_CELLS)
const titleFrame = computed(() => marqueeFrame(title.value, TITLE_CELLS, reducedMotion.value ? 0 : Math.floor(playMs.value / SCROLL)))

/** What each line of the glass shows: all segments during the check, nothing when off. */
const display = computed(() => {
  if (booting.value)
    return { tag: '8'.repeat(8), time: '88:88', mode: '8888', main: '8'.repeat(TITLE_CELLS) }
  if (!power.value)
    return { tag: '', time: '', mode: '', main: '' }
  const mode = playing.value ? 'PLAY' : 'STOP'
  if (notice.value)
    return { tag: notice.value.tag, time: '', mode, main: notice.value.text }
  return { tag: `TRACK ${trackNumber.value}`, time: clock(Math.floor(playMs.value / 1000)), mode, main: titleFrame.value }
})

// While playing, the meters follow the made-up signal, scaled by the gain; stopped, they show the
// gain itself, as an input monitor would.
const levels = computed(() => {
  if (booting.value)
    return [100, 100]
  if (!power.value)
    return [0, 0]
  if (!playing.value || reducedMotion.value)
    return [gain.value, Math.round(gain.value * 0.85)]
  return ([0, 1] as const).map(channel => Math.min(100, Math.round(gain.value * 1.3 * levelAt(playMs.value, channel))))
})

const presets: { label: string, name: string, color: FpCapColor }[] = [
  { label: 'A', name: 'Flat', color: 'white' },
  { label: 'B', name: 'Bass', color: 'blue' },
  { label: 'C', name: 'Vocal', color: 'amber' },
  { label: 'D', name: 'Live', color: 'graphite' },
  { label: 'E', name: 'Night', color: 'berry' },
]
const preset = ref('B')

function pickPreset(choice: typeof presets[number]) {
  preset.value = choice.label
  showNotice('EQ', choice.name.toUpperCase(), `EQ preset: ${choice.name}`)
}

// The SKIN button steps the page's skin (VitePress's isDark, which the theme turns into
// data-fp-skin) and borrows the display to name it.
const skinNames = {
  silver: { lcd: 'SILVER', full: 'Chrome Silver' },
  gunmetal: { lcd: 'GUNMETAL', full: 'Gunmetal Night' },
} as const
const { isDark } = useData()

function nextSkin() {
  isDark.value = !isDark.value
  const skin = skinNames[isDark.value ? 'gunmetal' : 'silver']
  showNotice('SKIN', skin.lcd, `Skin: ${skin.full}`)
}

onBeforeUnmount(() => {
  clearTimeout(noticeTimer)
  clearTimeout(bootTimer)
  clearInterval(clockTimer)
  motionQuery?.removeEventListener('change', onMotion)
})
</script>

<template>
  <FpDevice fit="width" :width="600" :backdrop="!hero" class="deck" :class="{ framed: !hero }">
    <div class="body">
      <header class="top">
        <div class="side">
          <FpScrew />
          <!-- The power symbol silkscreened before the rocker, as on a device; the switch is named in words. -->
          <span class="power">
            <FpIcon name="power" class="mark" />
            <FpSwitch v-model="power" aria-label="Power" orientation="horizontal" />
          </span>
        </div>
        <FpSilk as="h3" class="name">
          Desk player
        </FpSilk>
        <div class="side end">
          <FpHousing>
            <FpLed :lit="booting || (ready && playing)" /> PLAY
          </FpHousing>
          <FpHousing>
            <!-- Re-keyed on each save so the LED blinks twice again. -->
            <FpLed :key="saves" color="amber" :lit="booting || (ready && saves > 0)" :blink="!booting" /> SAVED
          </FpHousing>
          <FpScrew />
        </div>
      </header>

      <FpLcd class="lcd" aria-label="Display">
        <div class="lcd-row">
          <FpLcdLine :text="display.tag" ghost :cells="8" class="small" />
          <FpLcdLine :text="display.time" ghost :cells="5" class="small" />
          <FpLcdLine :text="display.mode" ghost :cells="4" class="small" />
        </div>
        <!-- The glass shows the title a frame at a time; screen readers get it whole, and the status line says each change. -->
        <FpLcdLine :text="display.main" :redraw="!scrolling" ghost :cells="TITLE_CELLS" class="large" aria-hidden="true" />
        <span v-if="ready" class="sr-only">{{ notice ? notice.text : current.title }}</span>
      </FpLcd>

      <div class="row" role="group" aria-label="Transport">
        <FpButton aria-label="Previous track" :disabled="!ready" @click="step(-1)">
          <FpIcon name="left" />
        </FpButton>
        <FpButton :pressed="playing" :disabled="!ready" @click="playing = !playing">
          <FpIcon name="play" /> Play
        </FpButton>
        <FpButton aria-label="Next track" :disabled="!ready" @click="step(1)">
          <FpIcon name="right" />
        </FpButton>
        <FpButton disabled>
          Eject
        </FpButton>
        <FpButton :pressed="playlistOpen" @click="playlistOpen = !playlistOpen">
          <FpIcon name="grid" /> List
        </FpButton>
        <FpButton v-if="hero" @click="nextSkin">
          Skin
        </FpButton>
        <FpGelButton class="save" @click="saves++">
          <FpIcon name="save" /> Save
        </FpGelButton>
      </div>

      <div class="row" role="group" aria-label="EQ preset">
        <FpCap
          v-for="choice in presets"
          :key="choice.label"
          :color="choice.color"
          :pressed="preset === choice.label"
          :aria-label="`${choice.label}, ${choice.name}`"
          :disabled="!ready"
          class="cap"
          @click="pickPreset(choice)"
        >
          {{ choice.label }}
        </FpCap>
      </div>

      <div class="windows">
        <FpWindow v-if="playlistOpen" title="Playlist" :level="4" closable class="playlist fp-scroll-thin" @close="playlistOpen = false">
          <FpWell as="ol" class="list">
            <li v-for="(entry, index) in tracks" :key="entry.title" :aria-current="index === track ? 'true' : undefined">
              {{ entry.title.toUpperCase() }}
            </li>
          </FpWell>
        </FpWindow>
        <FpWell v-else class="empty">
          <FpSilk>Playlist closed</FpSilk>
        </FpWell>

        <FpWindow v-if="hero" title="Levels" :level="4">
          <div class="levels">
            <FpSlider v-model="gain" label="Gain" />
            <FpMeter :value="levels[0]" label="L" />
            <FpMeter :value="levels[1]" label="R" />
            <!-- The knob says its own value, so the readout that repeats it stays out of the way. -->
            <div class="dial">
              <FpReadout :value="booting ? 888 : power ? volume : ''" :digits="3" color="amber" aria-hidden="true" />
              <FpKnob v-model="volume" label="Volume" :value-text="v => `${v} percent`" />
            </div>
          </div>
        </FpWindow>
        <FpWindow v-else title="Icons" :level="4">
          <ul class="icons">
            <li v-for="name in fpIconNames" :key="name">
              <FpIcon :name="name" :label="name" />
            </li>
          </ul>
        </FpWindow>
      </div>
    </div>
    <span class="sr-only" role="status">{{ status }}</span>
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

/* Equal sides, so the name sits on the deck's centre line whatever stands either side of it. */
.top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

.side,
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.end {
  justify-content: flex-end;
}

.power {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

/* In the silkscreen's ink, as a printed label. */
.mark {
  color: var(--fp-color-ink-soft);
}

.name {
  margin: 0;
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.75rem;
  align-items: start;
}

.playlist {
  max-height: 13.75rem;
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

/* Sized so the levels window stands as tall as the playlist beside it. */
.levels {
  --fp-fader-length: 5rem;
  --fp-meter-length: 5rem;

  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
  padding: 1.25rem 0.75rem;
}

.dial {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  margin-inline-start: 0.5rem;
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
