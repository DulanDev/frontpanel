<script setup lang="ts">
import {
  FpButton,
  FpButtonGroup,
  FpCap,
  FpCheckbox,
  FpCheckboxGroup,
  FpGelButton,
  FpHousing,
  FpIcon,
  fpIconNames,
  FpKnob,
  FpLcd,
  FpLcdLine,
  FpLed,
  FpMenu,
  FpMenuItem,
  FpMenuSeparator,
  FpMeter,
  FpRadioGroup,
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
const sources = ['TAPE', 'TUNER', 'AUX'] as const
const source = ref<string>('TAPE')
const tapes = [
  { value: 'normal', label: 'Normal' },
  { value: 'chrome', label: 'Chrome', color: 'amber' as const },
  { value: 'metal', label: 'Metal', color: 'red' as const },
]
const tape = ref('chrome')
const bands = [
  { value: 'fm', label: 'FM' },
  { value: 'am', label: 'AM' },
  { value: 'sw', label: 'SW' },
]
const band = ref('fm')
const speeds = [
  { value: 'slow', label: 'Slow' },
  { value: 'norm', label: 'Norm' },
  { value: 'fast', label: 'Fast', disabled: true },
]
const speed = ref('norm')
const inputs = [
  { value: 'lowcut', label: 'Low cut' },
  { value: 'pad', label: 'Pad', color: 'amber' as const },
  { value: 'rec', label: 'Rec', color: 'red' as const },
]
const latched = ref(['lowcut'])
const paused = ref(false)
const muted = ref(true)
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

## FpButtonGroup

Chrome buttons joined into one bezel, as on a transport row: they share their seams, and only the
outer corners stay round. It is a `role="group"`, so name it with `aria-label`.

<div class="vp-raw demo demo-surface demo-row">
  <FpButtonGroup aria-label="Transport">
    <FpButton aria-label="Previous track"><FpIcon name="left" /></FpButton>
    <FpButton :pressed="playing" @click="playing = !playing"><FpIcon name="play" /> Play</FpButton>
    <FpButton aria-label="Next track"><FpIcon name="right" /></FpButton>
  </FpButtonGroup>
</div>

<ApiTable name="FpButtonGroup" />

## FpMenu

A faceplate menu: a brushed-chrome plate that drops from the button in its `trigger` slot, holding
`FpMenuItem` rows and `FpMenuSeparator` grooves. Press the button, or focus it and press Enter,
Space or the down arrow; the arrow keys move along the rows, a letter jumps to a row, and Escape
closes it. Choosing a row emits `select` and closes the menu, and `as="a"` makes a row a link. The
button stays held down while the menu is open. The plate is mounted at the end of the page and
takes the skin around its button with it.

<div class="vp-raw demo demo-surface demo-row">
  <FpMenu>
    <template #trigger>
      <FpButton>Source <FpIcon name="down" /></FpButton>
    </template>
    <FpMenuItem v-for="name in sources" :key="name" @select="source = name">{{ name }}</FpMenuItem>
    <FpMenuSeparator />
    <FpMenuItem disabled>Eject</FpMenuItem>
  </FpMenu>
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="`SRC ${source}`" class="demo-lcd-line" />
  </FpLcd>
</div>

Its button can sit in an `FpButtonGroup`, joined to the action it offers more of:

<div class="vp-raw demo demo-surface demo-row">
  <FpButtonGroup aria-label="Save">
    <FpButton @click="saves++"><FpIcon name="save" /> Save</FpButton>
    <FpMenu align="end">
      <template #trigger>
        <FpButton aria-label="More save options"><FpIcon name="down" /></FpButton>
      </template>
      <FpMenuItem @select="saves++">Save a copy</FpMenuItem>
      <FpMenuSeparator />
      <FpMenuItem @select="saves = 0">Clear</FpMenuItem>
    </FpMenu>
  </FpButtonGroup>
  <FpHousing><FpLed :key="saves" color="amber" :lit="saves > 0" blink /> {{ saves }} SAVED</FpHousing>
</div>

```vue
<FpButtonGroup aria-label="Save">
  <FpButton @click="save">Save</FpButton>
  <FpMenu align="end">
    <template #trigger>
      <FpButton aria-label="More save options"><FpIcon name="down" /></FpButton>
    </template>
    <FpMenuItem @select="saveCopy">Save a copy</FpMenuItem>
    <FpMenuSeparator />
    <FpMenuItem as="a" href="/help">Help</FpMenuItem>
  </FpMenu>
</FpButtonGroup>
```

<ApiTable name="FpMenu" />

<ApiTable name="FpMenuItem" />

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
boolean and `label` names it. The lamp is red; `color` lights it green or amber.
`orientation="horizontal"` lays it on its side, O on the left and I on the right, and
`label-placement="start"` puts the label level with it, before it in the line. Only the label goes
with it: a switch is always on or off, so show a fault where the device reports one, on its readout
or an LED, as the readout here does.

<div class="vp-raw demo demo-surface demo-row">
  <div class="fp-module demo-row demo-module">
    <FpSwitch v-model="power" label="Power" />
    <FpSwitch v-model="monitor" label="Monitor" color="green" />
    <FpSwitch v-model="record" label="Rec" color="amber" orientation="horizontal" label-placement="start" />
  </div>
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="record && !power ? 'REC NEEDS PWR' : `PWR ${power ? 'ON' : 'OFF'} MON ${monitor ? 'ON' : 'OFF'}`" class="demo-lcd-line" />
  </FpLcd>
</div>

```vue
<FpSwitch v-model="power" label="Power" />

<FpSwitch v-model="record" label="Rec" orientation="horizontal" label-placement="start" />
```

<ApiTable name="FpSwitch" />

## FpRadioGroup

A row of latching piano keys, after the key row on an old cassette deck: press a key and it latches
down as the last one comes up, and the arrow keys move the latch along the row. Each option is
`{ value, label, disabled?, color? }`; its `label` is printed over its key and names it, and `label`
on the group goes under the well and names the group. The strip at each key's foot is an LED that
lights while the key is latched, green unless `color`, or an option's own `color`, says otherwise.
`led="above"` puts an LED over each label instead, and `led="none"` leaves the strips as plain
plastic, so the latch alone shows the choice. `orientation="vertical"` lays the keys on their side,
stacked, each label before its key.

<div class="vp-raw demo demo-surface demo-row">
  <div class="fp-module demo-row demo-module">
    <FpRadioGroup v-model="tape" :options="tapes" label="Tape" />
    <FpRadioGroup v-model="band" :options="bands" label="Band" led="above" color="amber" />
    <FpRadioGroup v-model="speed" :options="speeds" label="Speed" orientation="vertical" led="none" />
  </div>
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="`${tape.toUpperCase()} ${band.toUpperCase()} ${speed.toUpperCase()}`" class="demo-lcd-line" />
  </FpLcd>
</div>

```vue
<script setup lang="ts">
const tapes = [
  { value: 'normal', label: 'Normal' },
  { value: 'chrome', label: 'Chrome', color: 'amber' },
  { value: 'metal', label: 'Metal', color: 'red' },
]
const tape = ref('chrome')
</script>

<FpRadioGroup v-model="tape" :options="tapes" label="Tape" />

<FpRadioGroup v-model="band" :options="bands" label="Band" led="above" color="amber" />

<FpRadioGroup v-model="speed" :options="speeds" label="Speed" orientation="vertical" led="none" />
```

<ApiTable name="FpRadioGroup" />

## FpCheckbox and FpCheckboxGroup

Piano keys that latch on their own, like a deck's pause key: press one to latch it down, press it
again to let it up. `FpCheckbox` is one key in its own well, with a boolean `v-model` and its
`label` over it. The LED and `orientation` work as on FpRadioGroup.

<div class="vp-raw demo demo-surface demo-stack">
  <div class="fp-module demo-row demo-module">
    <FpCheckboxGroup v-model="latched" :options="inputs" label="Input" />
    <FpCheckbox v-model="paused" label="Pause" color="amber" />
    <FpCheckbox v-model="muted" label="Mute" led="above" color="red" />
  </div>
  <FpLcd class="demo-lcd">
    <FpLcdLine :text="paused ? 'PAUSED' : `IN ${latched.length ? latched.join(' ').toUpperCase() : 'FLAT'}${muted ? ' MUTE' : ''}`" class="demo-lcd-line" />
  </FpLcd>
</div>

```vue
<FpCheckboxGroup v-model="latched" :options="inputs" label="Input" />

<FpCheckbox v-model="paused" label="Pause" color="amber" />

<FpCheckbox v-model="muted" label="Mute" led="above" color="red" />
```

<ApiTable name="FpCheckbox" />

`FpCheckboxGroup` sets a row of these keys in one well: `v-model` holds the values of the latched
options, and each key is still its own stop for Tab. The options, the LED and `orientation` work as
on FpRadioGroup.

<ApiTable name="FpCheckboxGroup" />

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
