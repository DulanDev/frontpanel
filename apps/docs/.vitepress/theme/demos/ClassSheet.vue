<script setup lang="ts">
// Every core class on one device panel, as raw classes, in the skin it is given.
import { fpReadoutGlyph } from '@frontpanel/vue'
import { ref } from 'vue'

defineProps<{
  skin: { id: 'silver' | 'gunmetal', name: string }
}>()

const caps = [
  { label: 'C', variant: '' },
  { label: 'Am', variant: 'fp-cap-blue' },
  { label: 'G7', variant: 'fp-cap-amber' },
  { label: 'E5', variant: 'fp-cap-graphite' },
  { label: 'Fmaj7', variant: 'fp-cap-berry' },
]

// The pixel set's close icon, copied from @frontpanel/vue (fpIconPaths.close), since the sheet uses
// no components.
const close = 'M2 2h2v1h-2zM12 2h2v1h-2zM2 3h3v1h-3zM11 3h3v1h-3zM3 4h3v1h-3zM10 4h3v1h-3zM4 5h3v1h-3zM9 5h3v1h-3zM5 6h6v1h-6zM6 7h4v1h-4zM6 8h4v1h-4zM5 9h6v1h-6zM4 10h3v1h-3zM9 10h3v1h-3zM3 11h3v1h-3zM10 11h3v1h-3zM2 12h3v1h-3zM11 12h3v1h-3zM2 13h2v1h-2zM12 13h2v1h-2z'

// A clock on the readout, lit from the exported glyphs rather than the component.
const clock = [...'12:05']

// Two rockers on plain classes: the button carries role="switch" and aria-checked, and the look follows.
const power = ref(true)
const monitor = ref(false)

// Piano keys on plain classes: radio keys the arrows move between, as a radio group does, and one
// checkbox key with a plain strip.
const bands = ['FM', 'AM', 'SW']
const band = ref('FM')
const paused = ref(false)
function stepBand(event: KeyboardEvent, by: number) {
  const next = bands[(bands.indexOf(band.value) + by + bands.length) % bands.length]!
  band.value = next
  const keys = (event.currentTarget as HTMLElement).parentElement!.querySelectorAll<HTMLElement>('.fp-key')
  keys[bands.indexOf(next)]!.focus()
}

const tracks = ['01 Intro', '02 Chrome Horizon', '03 Gel Pressure', '04 Silkscreen', '05 Backlight', '06 Two Blinks', '07 Rim Light', '08 Outro']
</script>

<template>
  <section :data-fp-skin="skin.id" class="fp-device-backdrop skin" :aria-label="skin.name">
    <div class="fp-device-rim">
      <div class="fp-device-body body">
        <div class="fp-module">
          <div class="fp-module-title">
            <span class="fp-screw" aria-hidden="true" />
            <span class="fp-silk">{{ skin.name }}</span>
            <span class="fp-screw push" aria-hidden="true" />
          </div>

          <div class="stack">
            <div class="fp-lcd lcd">
              <p class="fp-lcd-line">
                <span class="fp-lcd-ghost" aria-hidden="true">88888888888888888</span>
                <span>NOW PLAYING 02:41</span>
              </p>
              <span class="fp-lcd-redraw">CHROME HORIZON</span>
            </div>

            <div class="row">
              <span class="fp-housing">
                <span class="fp-led fp-led-green fp-led-lit fp-lens-flat" /> PWR
              </span>
              <span class="fp-housing">
                <span class="fp-led fp-led-amber fp-led-lit fp-lens-clear fp-blink-twice" /> REC
              </span>
              <span class="fp-housing">
                <span class="fp-led fp-led-red" /> CLIP
              </span>
              <span class="fp-readout fp-led-amber">
                <span class="fp-readout-text">12:05</span>
                <span
                  v-for="(character, index) in clock"
                  :key="index"
                  class="fp-readout-cell"
                  :data-colon="character === ':' ? '' : undefined"
                  aria-hidden="true"
                >
                  <span class="fp-readout-lit">
                    <template v-if="character === ':'">
                      <span data-segment="colon-upper" />
                      <span data-segment="colon-lower" />
                    </template>
                    <span v-for="segment in fpReadoutGlyph(character)" v-else :key="segment" :data-segment="segment" />
                  </span>
                </span>
              </span>
            </div>

            <div class="row">
              <div class="fp-button-group" role="group" aria-label="Transport">
                <button type="button" class="fp-chrome-btn">
                  Prev
                </button>
                <button type="button" class="fp-chrome-btn" aria-pressed="true">
                  Play
                </button>
                <button type="button" class="fp-chrome-btn">
                  Next
                </button>
              </div>
              <button type="button" class="fp-chrome-btn" disabled>
                Eject
              </button>
              <button type="button" class="fp-gel">
                Save
              </button>
            </div>

            <div class="row" role="group" aria-label="Caps">
              <button
                v-for="(cap, index) in caps"
                :key="cap.label"
                type="button"
                class="fp-cap"
                :class="[cap.variant]"
                :aria-pressed="index === 1"
              >
                {{ cap.label }}
              </button>
            </div>

            <!-- A specimen of the plate, held open: it is not a working menu, so it is hidden. -->
            <div class="fp-menu menu" aria-hidden="true">
              <div class="fp-menu-item">
                Open
              </div>
              <div class="fp-menu-item" data-highlighted>
                Save as
              </div>
              <div class="fp-menu-separator" />
              <div class="fp-menu-item" data-disabled>
                Eject
              </div>
            </div>

            <div class="fp-module fp-window fp-lens-diffused">
              <div class="fp-module-title">
                <h3 class="fp-silk fp-window-title">
                  Mixer
                </h3>
                <button type="button" class="fp-chrome-btn" aria-label="Close mixer">
                  <svg viewBox="0 0 16 16" class="fp-icon" aria-hidden="true"><path :d="close" /></svg>
                </button>
              </div>
              <!-- A specimen of the look: the knob and fader do not move here, so they are hidden. -->
              <div class="fp-window-body row mixer">
                <div class="fp-unit" aria-hidden="true">
                  <div class="fp-knob">
                    <span class="fp-knob-mark" style="rotate: 45deg" />
                  </div>
                  <span class="fp-silk">Tone</span>
                </div>
                <div class="fp-unit" aria-hidden="true">
                  <div class="fp-fader" data-orientation="vertical">
                    <span class="fp-fader-slot" data-orientation="vertical" />
                    <span class="fp-fader-cap" data-orientation="vertical" style="bottom: 45%" />
                  </div>
                  <span class="fp-silk">Gain</span>
                </div>
                <div class="fp-unit">
                  <div class="fp-meter" role="meter" aria-label="Left" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" style="--fp-meter-level: 0.75" />
                  <span class="fp-silk" aria-hidden="true">L</span>
                </div>
                <div class="fp-unit">
                  <div class="fp-meter" role="meter" aria-label="Right" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" style="--fp-meter-level: 1" />
                  <span class="fp-silk" aria-hidden="true">R</span>
                </div>
                <div class="fp-meter" data-orientation="horizontal" role="meter" aria-label="Input" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="--fp-meter-level: 0.5" />
                <div class="fp-unit">
                  <button type="button" role="switch" class="fp-switch" :aria-checked="power" aria-label="Power" @click="power = !power">
                    <span class="fp-switch-rocker"><span class="fp-switch-lamp" /><span class="fp-switch-face" /></span>
                  </button>
                  <span class="fp-silk" aria-hidden="true">Power</span>
                </div>
                <div class="fp-unit" data-label-placement="start">
                  <button type="button" role="switch" class="fp-switch fp-led-green" data-orientation="horizontal" :aria-checked="monitor" aria-label="Monitor" @click="monitor = !monitor">
                    <span class="fp-switch-rocker"><span class="fp-switch-lamp" /><span class="fp-switch-face" /></span>
                  </button>
                  <span class="fp-silk" aria-hidden="true">Monitor</span>
                </div>
                <div class="fp-unit">
                  <div class="fp-keys" role="radiogroup" :aria-labelledby="`${skin.id}-band`">
                    <template v-for="choice in bands" :key="choice">
                      <span :id="`${skin.id}-band-${choice}`" class="fp-silk">{{ choice }}</span>
                      <button
                        type="button"
                        role="radio"
                        class="fp-key fp-led-amber"
                        :aria-checked="band === choice"
                        :tabindex="band === choice ? 0 : -1"
                        :aria-labelledby="`${skin.id}-band-${choice}`"
                        @click="band = choice"
                        @keydown.right.prevent="stepBand($event, 1)"
                        @keydown.left.prevent="stepBand($event, -1)"
                      />
                    </template>
                  </div>
                  <span :id="`${skin.id}-band`" class="fp-silk">Band</span>
                </div>
                <div class="fp-keys">
                  <span :id="`${skin.id}-pause`" class="fp-silk">Pause</span>
                  <button type="button" role="checkbox" class="fp-key" data-strip="plain" :aria-checked="paused" :aria-labelledby="`${skin.id}-pause`" @click="paused = !paused" />
                </div>
              </div>
            </div>

            <div class="fp-well well">
              <span class="fp-silk">Playlist</span>
              <ol class="fp-scroll-thin playlist">
                <li v-for="track in tracks" :key="track">
                  {{ track }}
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div class="fp-chrome strip" aria-hidden="true" />
        <div class="fp-chrome-soft strip label-strip">
          <span class="fp-silk">Brushed chrome</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skin {
  padding: 1.5rem;
  border-radius: 12px;
  color: var(--fp-color-ink);
}

.body {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.push {
  margin-inline-start: auto;
}

.stack {
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.lcd {
  display: grid;
  padding: 0.5rem 0.75rem;
  font-family: var(--fp-font-lcd);
  font-size: 1.5rem;
  line-height: 1.1;
}

.menu {
  justify-self: start;
}

.mixer {
  gap: 1rem;
}

.well {
  display: grid;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem;
}

.playlist {
  max-height: 6.5rem;
  margin: 0;
  padding-inline-start: 1.25rem;
  overflow-y: auto;
  font-size: 13px;
}

.strip {
  height: 1.5rem;
  border-radius: 6px;
}

.label-strip {
  display: grid;
  place-items: center;
}
</style>
