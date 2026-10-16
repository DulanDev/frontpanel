<script setup lang="ts">
import {
  FpButton,
  FpCap,
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
import { ref } from 'vue'
import ApiTable from '../.vitepress/theme/ApiTable.vue'
import DeckDemo from '../.vitepress/theme/demos/DeckDemo.vue'

const playing = ref(false)
const bank = ref('blue')
const caps = ['white', 'blue', 'amber', 'graphite', 'berry'] as const
const tracks = ['CHROME HORIZON', 'GEL PRESSURE', 'SILKSCREEN']
const track = ref(0)
const saves = ref(0)
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
  <FpButton :pressed="playing" @click="playing = !playing"><FpIcon name="go" /> Play</FpButton>
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
