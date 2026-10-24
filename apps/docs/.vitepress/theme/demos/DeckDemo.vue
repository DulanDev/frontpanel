<script setup lang="ts">
import type { FpCapColor } from '@frontpanel/vue'
import {
  FpButton,
  FpCap,
  FpDevice,
  FpGelButton,
  FpHousing,
  FpIcon,
  FpKnob,
  FpLcd,
  FpLcdLine,
  FpLed,
  FpMeter,
  FpReadout,
  FpScrew,
  FpSilk,
  FpSwitch,
  FpWell,
  FpWindow,
} from '@frontpanel/vue'
import { useData } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { intro } from './intro'
import { bandsAt, clock, levelAt, marqueeFrame } from './player'

// A desk media player built from the Vue components, drawn at 720 px (520 on a phone) and scaled to fit:
// speaker grilles either side, the display with its spectrum, the transport round a gel Play, the
// volume and its meters, and a disc slot. Every control does what it would on the device: power-on
// lights every segment for a moment, Play runs the counter, the spectrum and the meters, a long
// title steps across the glass, the caps pick an EQ preset and Eject opens the tray. It wears the
// page's skin, which follows the appearance toggle. In the home page's hero it drops its backdrop,
// since the page stands on one already, gains a Skin button, and starts itself up on first load.

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
/** Bands on the spectrum display, and the segments in each. */
const BANDS = 12
const BAND_SEGMENTS = 9
/** Milliseconds per tick of the clock that runs play, the meters, the spectrum and the title. */
const TICK = 100
/** Milliseconds a long title rests on each cell. */
const SCROLL = 300
/** How long the display shows a setting it has just changed, the start-up check, and reading a disc. */
const NOTICE = 1500
const BOOT = 900
const READ = 1200

const track = ref(0)
const playing = ref(false)
/** How far into the track play has run, in milliseconds. */
const playMs = ref(0)
const playlistOpen = ref(false)
const volume = ref(hero ? 0 : 70)

const current = computed(() => tracks[track.value]!)
const trackNumber = computed(() => String(track.value + 1).padStart(2, '0'))

/** What the status line says once a track, preset, skin or the tray changes; never on load. */
const status = ref('')

// Reduced motion keeps every state and drops the movement: the meters hold steady, the spectrum
// stands still and a long title stays on its start. The counter still counts.
const reducedMotion = ref(false)
let motionQuery: MediaQueryList | undefined
function onMotion(event: MediaQueryListEvent) {
  reducedMotion.value = event.matches
}

// On a phone the deck drops its grilles and is drawn narrower, so it scales down less.
const compact = ref(false)
let compactQuery: MediaQueryList | undefined
function onCompact(event: MediaQueryListEvent) {
  compact.value = event.matches
}

onMounted(() => {
  motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotion)
  compactQuery = matchMedia('(max-width: 640px)')
  compact.value = compactQuery.matches
  compactQuery.addEventListener('change', onCompact)
})

// The rocker powers the deck. On, it lights every segment and LED for a moment, as a device checks
// its display, then settles. Off, the glass shows only its ghost segments, the LEDs, meters and
// readout go dark, play stops and the controls wait. The knob still turns, as a pot does.
const power = ref(!hero)
const booting = ref(false)
const ready = computed(() => power.value && !booting.value)
let bootTimer: ReturnType<typeof setTimeout> | undefined

// Eject opens the tray and stops play; pressed again it closes and reads the disc from the top.
const trayOpen = ref(false)
const reading = ref(false)
/** A disc is in, read and ready to play. */
const loaded = computed(() => ready.value && !trayOpen.value && !reading.value)
let readTimer: ReturnType<typeof setTimeout> | undefined

// A setting the display names for a moment after it changes, in place of the track, as a player
// shows a setting it has just changed.
const notice = ref<{ tag: string, text: string }>()
let noticeTimer: ReturnType<typeof setTimeout> | undefined

function showNotice(tag: string, text: string, said: string) {
  status.value = said
  clearTimeout(noticeTimer)
  if (!loaded.value)
    return
  notice.value = { tag, text }
  noticeTimer = setTimeout(() => {
    notice.value = undefined
  }, NOTICE)
}

function stopAll() {
  clearTimeout(noticeTimer)
  clearTimeout(readTimer)
  notice.value = undefined
  playing.value = false
  playMs.value = 0
}

// Synchronous, so a start-up can power on and settle the check straight after.
watch(power, (on) => {
  clearTimeout(bootTimer)
  stopAll()
  trayOpen.value = false
  reading.value = false
  booting.value = on
  if (on) {
    bootTimer = setTimeout(() => {
      booting.value = false
    }, BOOT)
  }
}, { flush: 'sync' })

function eject() {
  if (!trayOpen.value) {
    stopAll()
    trayOpen.value = true
    status.value = 'Tray open'
    return
  }
  trayOpen.value = false
  reading.value = true
  readTimer = setTimeout(() => {
    reading.value = false
    track.value = 0
    status.value = `Disc read. Track 01: ${tracks[0]!.title}`
  }, READ)
}

// One clock runs play: the counter, the meters, the spectrum and a long title all follow playMs.
let clockTimer: ReturnType<typeof setInterval> | undefined
watch(() => playing.value && loaded.value, (running) => {
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

function stop() {
  playing.value = false
  playMs.value = 0
}

watch(track, () => {
  if (loaded.value)
    status.value = `Track ${trackNumber.value}: ${current.value.title}`
})

// The title steps across the glass while it plays, and holds where it is when paused.
const title = computed(() => current.value.title.toUpperCase())
const moving = computed(() => loaded.value && playing.value && !reducedMotion.value)
const scrolling = computed(() => moving.value && title.value.length > TITLE_CELLS)
const titleFrame = computed(() => marqueeFrame(title.value, TITLE_CELLS, reducedMotion.value ? 0 : Math.floor(playMs.value / SCROLL)))

/** What each line of the glass shows: all segments during the check, nothing when off. */
const display = computed(() => {
  if (booting.value)
    return { tag: '8'.repeat(8), time: '88:88', mode: '8888', main: '8'.repeat(TITLE_CELLS) }
  if (!power.value)
    return { tag: '', time: '', mode: '', main: '' }
  if (trayOpen.value)
    return { tag: 'NO DISC', time: '', mode: '', main: 'OPEN' }
  if (reading.value)
    return { tag: 'DISC', time: '', mode: '', main: 'READING' }
  const mode = playing.value ? 'PLAY' : playMs.value > 0 ? 'PAUS' : 'STOP'
  if (notice.value)
    return { tag: notice.value.tag, time: '', mode, main: notice.value.text }
  return { tag: `TRACK ${trackNumber.value}`, time: clock(Math.floor(playMs.value / 1000)), mode, main: titleFrame.value }
})

/** How lit each spectrum band is, in whole segments as shares of the band: dark until it plays. */
const bands = computed(() => {
  if (booting.value)
    return Array.from<number>({ length: BANDS }).fill(1)
  if (!loaded.value || !playing.value)
    return Array.from<number>({ length: BANDS }).fill(0)
  return bandsAt(reducedMotion.value ? 250 : playMs.value, BANDS)
    .map(level => Math.round(level * BAND_SEGMENTS) / BAND_SEGMENTS)
})

/** How far through the track play is, 0 to 1, for the progress line on the glass. */
const progress = computed(() => {
  if (booting.value)
    return 1
  return loaded.value ? playMs.value / (current.value.length * 1000) : 0
})

// The output meters follow the signal, scaled by the volume; quiet unless something plays.
const levels = computed(() => {
  if (booting.value)
    return [100, 100]
  if (!loaded.value || !playing.value)
    return [0, 0]
  const at = reducedMotion.value ? 250 : playMs.value
  return ([0, 1] as const).map(channel => Math.min(100, Math.round(volume.value * 1.3 * levelAt(at, channel))))
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

// The hero's start-up, once per page load: the deck sits off for a moment, powers up through its
// check, starts the first track and brings the volume up from nothing. Reduced motion skips to the
// end, without the check; a press or a key on the deck stops it where it is.
const INTRO_WAIT = 1000
const INTRO_FADE = 1500
const INTRO_VOLUME = 83
let introTimer: ReturnType<typeof setTimeout> | undefined
let introFrame: number | undefined

function endIntro() {
  clearTimeout(introTimer)
  if (introFrame !== undefined)
    cancelAnimationFrame(introFrame)
  introTimer = introFrame = undefined
}

function fadeIn() {
  const start = performance.now()
  const frame = (now: number) => {
    const done = Math.min(1, (now - start) / INTRO_FADE)
    volume.value = Math.round(INTRO_VOLUME * (1 - (1 - done) ** 3))
    introFrame = done < 1 ? requestAnimationFrame(frame) : undefined
  }
  introFrame = requestAnimationFrame(frame)
}

function startUp() {
  const skip = intro.played || reducedMotion.value
  intro.played = true
  if (skip) {
    power.value = true
    clearTimeout(bootTimer)
    booting.value = false
    volume.value = INTRO_VOLUME
    playing.value = true
    return
  }
  introTimer = setTimeout(() => {
    power.value = true
    introTimer = setTimeout(() => {
      playing.value = true
      fadeIn()
    }, BOOT)
  }, INTRO_WAIT)
}

onMounted(() => {
  if (hero)
    startUp()
})

function nextSkin() {
  isDark.value = !isDark.value
  const skin = skinNames[isDark.value ? 'gunmetal' : 'silver']
  showNotice('SKIN', skin.lcd, `Skin: ${skin.full}`)
}

onBeforeUnmount(() => {
  clearTimeout(noticeTimer)
  clearTimeout(bootTimer)
  clearTimeout(readTimer)
  clearInterval(clockTimer)
  endIntro()
  motionQuery?.removeEventListener('change', onMotion)
  compactQuery?.removeEventListener('change', onCompact)
})
</script>

<template>
  <FpDevice fit="width" :width="compact ? 520 : 720" :backdrop="!hero" class="deck" :class="{ framed: !hero, compact }" @pointerdown.capture="endIntro" @keydown.capture="endIntro">
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
            <FpLed :lit="booting || (loaded && playing)" /> PLAY
          </FpHousing>
          <FpHousing>
            <FpLed color="amber" :lit="booting || (loaded && preset !== 'A')" /> EQ
          </FpHousing>
          <FpScrew />
        </div>
      </header>

      <div class="face">
        <div class="grille" aria-hidden="true" />

        <div class="centre">
          <FpLcd class="lcd" aria-label="Display">
            <div class="lcd-row">
              <FpLcdLine :text="display.tag" ghost :cells="8" class="small" />
              <FpLcdLine :text="display.time" ghost :cells="5" class="small" />
              <FpLcdLine :text="display.mode" ghost :cells="4" class="small" />
            </div>
            <!-- The glass shows the title a frame at a time; screen readers get it whole, and the status line says each change. -->
            <FpLcdLine :text="display.main" :redraw="!scrolling" ghost :cells="TITLE_CELLS" class="large" aria-hidden="true" />
            <span v-if="loaded" class="sr-only">{{ notice ? notice.text : current.title }}</span>
            <!-- Drawn in the glass's own ink, over its unlit segments. -->
            <div class="lcd-foot" aria-hidden="true">
              <div class="spectrum">
                <span v-for="(band, index) in bands" :key="index" class="band" :style="{ '--lit': band }" />
              </div>
              <div class="progress" :style="{ '--done': progress }" />
            </div>
          </FpLcd>

          <div class="transport" role="group" aria-label="Transport">
            <FpButton aria-label="Previous track" :disabled="!loaded" @click="step(-1)">
              <FpIcon name="left" />
            </FpButton>
            <FpButton :disabled="!loaded" @click="stop">
              Stop
            </FpButton>
            <FpGelButton class="play" :disabled="!loaded" @click="playing = !playing">
              <FpIcon v-if="!playing" name="play" /> {{ playing ? 'Pause' : 'Play' }}
            </FpGelButton>
            <FpButton aria-label="Next track" :disabled="!loaded" @click="step(1)">
              <FpIcon name="right" />
            </FpButton>
            <FpButton :pressed="trayOpen" :disabled="!ready || reading" @click="eject">
              Eject
            </FpButton>
          </div>

          <div class="presets">
            <FpSilk>EQ</FpSilk>
            <div class="caps" role="group" aria-label="EQ preset">
              <FpCap
                v-for="choice in presets"
                :key="choice.label"
                :color="choice.color"
                :pressed="preset === choice.label"
                :aria-label="`${choice.label}, ${choice.name}`"
                :disabled="!loaded"
                class="cap"
                @click="pickPreset(choice)"
              >
                {{ choice.label }}
              </FpCap>
            </div>
            <div class="extras">
              <FpButton :pressed="playlistOpen" @click="playlistOpen = !playlistOpen">
                <FpIcon name="grid" /> List
              </FpButton>
              <FpButton v-if="hero" @click="nextSkin">
                Skin
              </FpButton>
            </div>
          </div>

          <div class="slot" :data-open="trayOpen || undefined" aria-hidden="true" />
        </div>

        <div class="output">
          <div class="meters">
            <FpMeter :value="levels[0]" label="L" :segments="10" />
            <FpMeter :value="levels[1]" label="R" :segments="10" />
          </div>
          <!-- The knob says its own value, so the readout that repeats it stays out of the way. -->
          <div class="dial">
            <FpReadout :value="booting ? 888 : power ? volume : ''" :digits="3" color="amber" aria-hidden="true" />
            <FpKnob v-model="volume" label="Volume" :value-text="v => `${v} percent`" />
          </div>
        </div>

        <div class="grille" aria-hidden="true" />
      </div>

      <FpWindow v-if="playlistOpen" title="Playlist" :level="4" closable class="playlist fp-scroll-thin" @close="playlistOpen = false">
        <FpWell as="ol" class="list">
          <li v-for="(entry, index) in tracks" :key="entry.title" :aria-current="index === track ? 'true' : undefined">
            <span class="length">{{ clock(entry.length) }}</span>
            {{ entry.title.toUpperCase() }}
          </li>
        </FpWell>
      </FpWindow>
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

.side {
  display: flex;
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
  font-size: 13px;
  letter-spacing: 0.2em;
}

/* Grilles either side of the controls, the full height of the face. */
.face {
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr) auto 4.5rem;
  gap: 0.875rem;
}

/*
 * A speaker grille: a recessed panel punched with holes, the cone's rim showing faintly through.
 * Each hole is the housing's dark, its lower right lip catching the light from the top left.
 */
.grille {
  border-radius: 14px;
  background-color: var(--fp-color-well);
  background-image:
    radial-gradient(circle, var(--fp-color-housing) 0 1.6px, transparent 2px),
    radial-gradient(circle at 60% 60%, var(--fp-color-bevel-hi) 0 1.6px, transparent 2px),
    radial-gradient(circle at 50% 50%, transparent 0 58%, rgb(0 0 0 / 0.07) 60% 66%, transparent 68%);
  background-size: 7px 7px, 7px 7px, 100% 100%;
  background-position: center;
  box-shadow:
    inset 1px 1px 3px var(--fp-color-bevel-lo),
    inset -1px -1px 0 var(--fp-color-bevel-hi);
}

/*
 * On a phone: no grilles, the display across the top, and the output beside the rows under it.
 * The centre column's parts join the face's grid for that.
 */
.compact .face {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.625rem;
}

.compact .grille {
  display: none;
}

.compact .centre {
  display: contents;
}

.compact .lcd {
  grid-column: 1 / -1;
}

.compact .output {
  grid-column: 2;
  grid-row: 2 / span 3;
}

.compact .presets {
  flex-wrap: wrap;
}

.compact .extras {
  margin-inline-start: 0;
}

.compact .dial :deep(.fp-knob) {
  width: 3rem;
  height: 3rem;
}

.centre {
  display: grid;
  gap: 0.625rem;
  align-content: start;
}

.lcd {
  display: grid;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem 0.625rem;
}

.lcd-row {
  display: flex;
  justify-content: space-between;
}

.small {
  font-size: 1.125rem;
  line-height: 1;
}

.large {
  font-size: 2.5rem;
  line-height: 1;
}

.lcd-foot {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
}

/* Each band a column of segments: the unlit ones in the glass's ghost, the lit ones in its ink. */
.spectrum {
  display: flex;
  gap: 3px;
}

.band {
  --segments: repeating-linear-gradient(to top, currentColor 0 3px, transparent 3px 4px);

  position: relative;
  width: 9px;
  height: 36px;
  color: var(--fp-color-lcd-ghost);
  background-image: var(--segments);
}

.band::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: calc(var(--lit) * 100%);
  color: var(--fp-color-lcd-ink);
  background-image: var(--segments);
}

.progress {
  --cells: repeating-linear-gradient(to right, currentColor 0 4px, transparent 4px 6px);

  position: relative;
  flex: 1;
  height: 6px;
  margin-bottom: 1px;
  color: var(--fp-color-lcd-ghost);
  background-image: var(--cells);
}

.progress::after {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: calc(var(--done) * 100%);
  color: var(--fp-color-lcd-ink);
  background-image: var(--cells);
}

.transport {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

/* The gel Play is the deck's main control, wider than the chrome around it. */
.play {
  flex: 1;
  min-width: 7rem;
}

.presets {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.caps {
  display: flex;
  gap: 0.375rem;
}

.cap {
  min-width: 2.5rem;
}

/* The disc goes in here: a dark mouth with a lip of light under it; open, the disc's edge shows. */
.slot {
  height: 10px;
  margin-top: 0.125rem;
  border-radius: 5px;
  background-color: var(--fp-color-housing);
  box-shadow:
    inset 0 2px 3px rgb(0 0 0 / 0.6),
    0 1px 0 var(--fp-color-bevel-hi);
}

.slot[data-open] {
  background-image: linear-gradient(180deg, transparent 0 30%, var(--fp-color-chrome-100) 30% 70%, transparent 70%);
  background-size: 70% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.output {
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 0.75rem;
}

.meters {
  --fp-meter-length: 4.5rem;

  display: flex;
  gap: 0.5rem;
}

.dial {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
}

/* The volume is the deck's big knob. */
.dial :deep(.fp-knob) {
  width: 4rem;
  height: 4rem;
}

.extras {
  display: flex;
  gap: 0.375rem;
  margin-inline-start: auto;
}

.playlist {
  max-height: 13.75rem;
  overflow-y: auto;
}

.list {
  margin: 0;
  padding: 0.375rem 0.75rem 0.375rem 1.75rem;
  font-size: 13px;
}

.list [aria-current] {
  font-weight: 700;
}

.length {
  float: inline-end;
  margin-inline-start: 1rem;
  font-variant-numeric: tabular-nums;
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
</style>
