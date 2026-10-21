<script setup lang="ts">
import {
  FpButton,
  FpCap,
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
import { ref } from 'vue'
import ApiTable from '../.vitepress/theme/ApiTable.vue'
import DeckDemo from '../.vitepress/theme/demos/DeckDemo.vue'

const playing = ref(false)
const bank = ref('blue')
const caps = ['white', 'blue', 'amber', 'graphite', 'berry'] as const
const tracks = ['CHROME HORIZON', 'GEL PRESSURE', 'SILKSCREEN']
const track = ref(0)
const saves = ref(0)
const volume = ref(70)
const tone = ref(-3)
const bass = ref(2)
const treble = ref(-4)
const balance = ref(0)
const power = ref(true)
const monitor = ref(false)
const record = ref(false)
const gain = ref(64)
const seconds = ref(125)
const lenses = ['flat', 'diffused', 'clear'] as const
</script>

# Components

`@frontpanel/vue` wears the `@frontpanel/css` classes and ships no CSS of its own, so import the
stylesheet once (see [Getting started](../guide/getting-started)). Behaviour and ARIA come from
[Reka UI](https://reka-ui.com). Element components take Reka's `as` and `asChild` to render as
another element or merge into their child.

The tables are read from each component's types and comments when the site builds.

## FpDevice

The device: a molded body in a liquid-chrome rim, on a quiet backdrop. Its modules go in the body.
With `fit="width"` or `fit="contain"` it draws the device at a design `width` and scales it to the
room it has; the default, `fit="none"`, leaves layout to your page, so its modules reflow at your
breakpoints.

<div class="vp-raw demo">
  <DeckDemo />
</div>

<ApiTable name="FpDevice" />

## FpWindow

A window on the device: a matte module with a chrome title bar. `closable` adds a close button
that emits `close`; `sheet` wears the phone bottom sheet from the page extra instead. `as`
renders it as another element, such as an `aside`, and `flush` leaves the body unpadded for
contents that run edge to edge.

<div class="vp-raw demo demo-surface">
  <FpWindow title="Playlist" :level="3" closable class="demo-window">
    <FpWell as="ol" class="demo-list">
      <li v-for="name in tracks" :key="name">{{ name }}</li>
    </FpWell>
  </FpWindow>
</div>

<ApiTable name="FpWindow" />

## FpButton

A small push button in brushed chrome. Set `pressed` to make it a toggle: it holds down and sets
`aria-pressed`.

<div class="vp-raw demo demo-surface demo-row">
  <FpButton aria-label="Previous track"><FpIcon name="left" /></FpButton>
  <FpButton :pressed="playing" @click="playing = !playing"><FpIcon name="play" /> Play</FpButton>
  <FpButton disabled>Eject</FpButton>
</div>

<ApiTable name="FpButton" />

## FpGelButton

The glossy gel pill, for the panel's main action. One per panel.

<div class="vp-raw demo demo-surface demo-row">
  <FpGelButton @click="saves++"><FpIcon name="save" /> Save</FpGelButton>
  <FpHousing><FpLed :key="saves" color="amber" :lit="saves > 0" blink /> SAVED</FpHousing>
</div>

<ApiTable name="FpGelButton" />

## FpCap

A molded-plastic cap. Selection shows as pressed in with a ring, never by colour alone.

<div class="vp-raw demo demo-surface demo-row" role="group" aria-label="Bank">
  <FpCap v-for="color in caps" :key="color" :color="color" :pressed="bank === color" class="demo-cap" @click="bank = color">{{ color[0]!.toUpperCase() }}</FpCap>
</div>

<ApiTable name="FpCap" />

## FpKnob

A rotary knob. Drag it up or down (hold Shift for fine moves), or use the arrow keys, PageUp and
PageDown, Home and End. `v-model` holds a number between `min` and `max`, snapped to `step`;
`valueCommit` fires when a drag ends or a key moves it. `label` puts a silkscreen label under the
knob and names it, and `valueText` says the value in words.

<div class="vp-raw demo demo-surface demo-row">
  <FpKnob v-model="volume" label="Volume" :value-text="v => `${v} percent`" />
  <FpKnob v-model="tone" label="Tone" :min="-12" :max="12" :value-text="v => `${v} dB`" />
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="`VOL ${volume} TONE ${tone > 0 ? '+' : ''}${tone}`" class="demo-lcd-line" />
  </FpLcd>
</div>

```vue
<FpKnob v-model="tone" label="Tone" :min="-12" :max="12" :value-text="v => `${v} dB`" />
```

<ApiTable name="FpKnob" />

## FpSlider

A fader: a chrome cap that slides along a slot. Drag the cap, press the slot to move it there, or
use the arrow keys, PageUp and PageDown, Home and End. It takes the same `v-model`, `label` and
`valueText` as `FpKnob`. It stands up by default; `orientation="horizontal"` lays it on its side,
and `--fp-fader-length` sets how far it travels.

<div class="vp-raw demo demo-surface demo-row">
  <FpSlider v-model="bass" label="Bass" :min="-12" :max="12" :value-text="v => `${v} dB`" />
  <FpSlider v-model="treble" label="Treble" :min="-12" :max="12" :value-text="v => `${v} dB`" />
  <FpSlider v-model="balance" label="Balance" orientation="horizontal" :min="-10" :max="10" />
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="`B ${bass} T ${treble} BAL ${balance}`" class="demo-lcd-line" />
  </FpLcd>
</div>

```vue
<FpSlider v-model="bass" label="Bass" :min="-12" :max="12" :value-text="v => `${v} dB`" />
```

<ApiTable name="FpSlider" />

## FpSwitch

An illuminated rocker: press it, or focus it and press Space or Enter, and the I half rocks in as
the lamp behind its lens lights; off, the lamp fades out as a filament cools. `v-model` holds a
boolean and `label` names it. The lamp is red; `color` lights it green or amber. Only the label sits
under it: a switch is always on or off, so show a fault where the device reports one, on its
readout or an LED, as the readout here does.

<div class="vp-raw demo demo-surface demo-row">
  <div class="fp-module demo-row demo-module">
    <FpSwitch v-model="power" label="Power" />
    <FpSwitch v-model="monitor" label="Monitor" color="green" />
    <FpSwitch v-model="record" label="Rec" color="amber" />
  </div>
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="record && !power ? 'REC NEEDS PWR' : `PWR ${power ? 'ON' : 'OFF'} MON ${monitor ? 'ON' : 'OFF'}`" class="demo-lcd-line" />
  </FpLcd>
</div>

```vue
<FpSwitch v-model="power" label="Power" />
```

<ApiTable name="FpSwitch" />

## FpMeter

A level meter: LED segments that light green, then amber from `amberAt`, then red from `redAt`. A
segment lights once the value reaches it. Pass `value`; it can change every frame. It stands up by
default; `orientation="horizontal"` lays it on its side, and `--fp-meter-length` sets how long it
is. Name it with `label` or `aria-label`, or hide it with `aria-hidden` when a readout beside it
says the same.

<div class="vp-raw demo demo-surface demo-row">
  <FpSlider v-model="gain" label="Gain" />
  <FpMeter :value="gain" label="L" />
  <FpMeter :value="gain * 0.85" label="R" />
  <FpMeter :value="gain * 0.6 - 60" :min="-60" :max="0" :amber-at="-12" :red-at="-3" orientation="horizontal" label="Input" :value-text="v => `${Math.round(v)} dB`" />
</div>

```vue
<FpMeter :value="level" :min="-60" :max="0" :amber-at="-12" :red-at="-3" label="Input" />
```

<ApiTable name="FpMeter" />

## FpReadout

A seven-segment readout: LED digits in a dark housing, with the unlit segments faintly showing.
It draws digits, a minus, a space and the letters such a display can; a `.` lights the decimal
point of the digit before it and a `:` adds a colon. `digits` pads it with dark cells on the left,
so a changing number keeps its width. Screen readers read the value as text, or the words
`valueText` gives.

<div class="vp-raw demo demo-surface demo-row">
  <FpReadout :value="`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`" :digits="4" color="amber" />
  <FpReadout :value="(tone / 2).toFixed(1)" :digits="4" :value-text="v => `${v} dB`" />
  <FpReadout value="Err" color="red" />
  <FpButton @click="seconds++">+1 s</FpButton>
</div>

```vue
<FpReadout :value="level.toFixed(1)" :digits="4" :value-text="v => `${v} dB`" />
```

Without Vue, each character is an `fp-readout-cell` holding an `fp-readout-lit` with one element
per lit segment, named by `data-segment`; `fpReadoutGlyph` from `@frontpanel/vue` gives the
segments a character lights. The cell draws the unlit ones itself:

```html
<span class="fp-readout fp-led-amber">
  <span class="fp-readout-text">7</span>
  <span class="fp-readout-cell" aria-hidden="true">
    <span class="fp-readout-lit"><span data-segment="a"></span><span data-segment="b"></span><span data-segment="c"></span></span>
  </span>
</span>
```

<ApiTable name="FpReadout" />

## FpLcd and FpLcdLine

LCD glass recessed into the chrome, and a line of text on it. `ghost` shows the unlit segments
behind the text, `cells` wide; `redraw` sweeps the line left to right when its text changes.

<div class="vp-raw demo demo-surface demo-row">
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="tracks[track]!" ghost :cells="14" redraw class="demo-lcd-line" aria-live="polite" />
  </FpLcd>
  <FpButton @click="track = (track + 1) % tracks.length">Next</FpButton>
</div>

<ApiTable name="FpLcd" />

<ApiTable name="FpLcdLine" />

## FpLed

A green, amber or red LED. It is decorative unless given a `label`: say what it means in text
nearby. `blink` blinks it twice when it lights; re-key it to blink again.

<div class="vp-raw demo demo-surface demo-row">
  <FpHousing><FpLed lit /> ON</FpHousing>
  <FpHousing><FpLed color="amber" lit /> REC</FpHousing>
  <FpHousing><FpLed color="red" lit /> CLIP</FpHousing>
  <FpHousing><FpLed /> OFF</FpHousing>
</div>

<ApiTable name="FpLed" />

## Lenses

A real LED has its chip in the middle of the segment, under a diffusing lens, so it is brightest
there. The lens sets how strong that is, for `FpLed`, `FpMeter` and `FpReadout`:
`fp-lens-diffused`, the default, gives a soft hot spot; `fp-lens-clear` a bright core and a wider
glow; `fp-lens-flat` an even fill. Put a lens class on any element to set every LED part inside
it, a whole device at once, or pass a part its own `lens`.

<div class="vp-raw demo demo-surface demo-row demo-lenses">
  <div v-for="lens in lenses" :key="lens" class="demo-lens" :class="`fp-lens-${lens}`">
    <FpReadout value="8.8" color="red" class="demo-readout-big" />
    <FpMeter :value="75" orientation="horizontal" aria-hidden="true" />
    <FpHousing><FpLed lit /> <FpLed color="amber" lit /> <FpLed color="red" lit /> {{ lens.toUpperCase() }}</FpHousing>
  </div>
</div>

```vue
<FpDevice class="fp-lens-clear">
  <FpReadout :value="time" />            <!-- clear, from the device -->
  <FpLed lit lens="flat" />              <!-- its own lens -->
</FpDevice>
```

## FpHousing, FpWell, FpSilk and FpScrew

A dark housing for LEDs and small readouts, a recessed well, a silkscreened label and a screw
head. Render `FpSilk` as a heading or `label` where it names something.

<div class="vp-raw demo demo-surface demo-row">
  <FpScrew />
  <FpSilk>Silkscreen</FpSilk>
  <FpHousing>HOUSING</FpHousing>
  <FpWell class="demo-well">Well</FpWell>
  <FpScrew />
</div>

<ApiTable name="FpHousing" />

## FpIcon

A 16 px pixel icon. It is decorative unless given a `label`; on an icon-only button, put
`aria-label` on the button instead.

<div class="vp-raw demo demo-surface demo-icons">
  <span v-for="name in fpIconNames" :key="name" class="demo-icon">
    <FpIcon :name="name" />
    <code>{{ name }}</code>
  </span>
</div>

<ApiTable name="FpIcon" />
