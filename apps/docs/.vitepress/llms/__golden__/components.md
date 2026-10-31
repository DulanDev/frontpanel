# Components

> Frontpanel 0.0.0 docs · https://dulandev.github.io/frontpanel/reference/components

`@frontpanel/vue` wears the `@frontpanel/css` classes and ships no CSS of its own, so import the
stylesheet once (see [Getting started](https://dulandev.github.io/frontpanel/guide/getting-started.md)). Behaviour and ARIA come from
[Reka UI](https://reka-ui.com). Element components take Reka's `as` and `asChild` to render as
another element or merge into their child.

The tables are read from each component's types and comments when the site builds.

## FpDevice

The device: a molded body in a liquid-chrome rim, on a quiet backdrop. Its modules go in the body.
With `fit="width"` or `fit="contain"` it draws the device at a design `width` and scales it to the
room it has; the default, `fit="none"`, leaves layout to your page, so its modules reflow at your
breakpoints.

*A live demo runs here on the site: https://dulandev.github.io/frontpanel/reference/components*

**`FpDevice`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `backdrop` | `boolean` | `true` | Sets the device on the gridded backdrop. Turn it off when the page already provides one. |
| `rim` | `boolean` | `true` | Rings the body in liquid chrome. Without it the body runs to the edges, as on a phone. |
| `fit` | `FpDeviceFit` | `"none"` | Scale-to-fit. `none` leaves layout to the page: the device fills its box and its modules reflow at your breakpoints. `width` draws the device at its design `width` and scales it to the width it has; `contain` scales it to fit both sides, which needs a box with a height of its own. |
| `width` | `number` |  | The design width in px, rim included, which scale-to-fit needs. |
| `height` | `number` |  | A fixed design height in px. Without it the device is as tall as its contents. |
| `maxScale` | `number` | `1` | The largest scale to-fit may reach. 1 keeps the device from growing past its design size. |

| Event or slot | Description |
| --- | --- |
| `#default` | The content. |

## FpWindow

A window on the device: a matte module with a chrome title bar. `closable` adds a close button
that emits `close`; `sheet` wears the phone bottom sheet from the page extra instead. `as`
renders it as another element, such as an `aside`, and `flush` leaves the body unpadded for
contents that run edge to edge.

```vue
<FpWindow title="Playlist" :level="3" closable>
  <FpWell as="ol">
    <li v-for="name in tracks" :key="name">{{ name }}</li>
  </FpWell>
</FpWindow>
```

**`FpWindow`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | The window's name, shown in the title bar; it also names the window for assistive tech. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | The title's heading level. |
| `closable` | `boolean` |  | Adds a close button to the title bar, which emits `close`. Closing removes the focused button, so move focus back to the control that opened the window. |
| `closeLabel` | `string` |  | The close button's accessible name. Defaults to "Close" and the title. |
| `sheet` | `boolean` |  | Wears the phone bottom sheet (`fp-sheet-panel`, in the opt-in page extra) instead of the module. Position the sheet and choose when to use it yourself; wrap it in `<Transition name="fp-sheet">`. |
| `flush` | `boolean` |  | Leaves the body unpadded, for contents that run edge to edge, like a list or a rack of rows. |

| Event or slot | Description |
| --- | --- |
| `@close` |  |
| `#default` | The content. |
| `#actions` | Extra title-bar buttons, set before the close button. |

## FpButton

A small push button in brushed chrome. Set `pressed` to make it a toggle: it holds down and sets
`aria-pressed`.

```vue
<FpButton aria-label="Previous track"><FpIcon name="left" /></FpButton>
<FpButton :pressed="playing" @click="playing = !playing"><FpIcon name="play" /> Play</FpButton>
<FpButton disabled>Eject</FpButton>
```

**`FpButton`** · takes Reka's `as` and `asChild`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` |  | Holds the button down and sets `aria-pressed`, for a toggle. Leave it unset for a plain push button. |

| Event or slot | Description |
| --- | --- |
| `#default` | The content. |

## FpButtonGroup

Chrome buttons joined into one bezel, as on a transport row: they share their seams, and only the
outer corners stay round. It is a `role="group"`, so name it with `aria-label`.

```vue
<FpButtonGroup aria-label="Transport">
  <FpButton aria-label="Previous track"><FpIcon name="left" /></FpButton>
  <FpButton :pressed="playing" @click="playing = !playing"><FpIcon name="play" /> Play</FpButton>
  <FpButton aria-label="Next track"><FpIcon name="right" /></FpButton>
</FpButtonGroup>
```

**`FpButtonGroup`** · takes Reka's `as` and `asChild`

No props of its own.

| Event or slot | Description |
| --- | --- |
| `#default` | The content. |

## FpMenu

A faceplate menu: a brushed-chrome plate that drops from the button in its `trigger` slot, holding
`FpMenuItem` rows and `FpMenuSeparator` grooves. Press the button, or focus it and press Enter,
Space or the down arrow; the arrow keys move along the rows, a letter jumps to a row, and Escape
closes it. Choosing a row emits `select` and closes the menu, and `as="a"` makes a row a link. The
button stays held down while the menu is open. The plate is mounted at the end of the page and
takes the skin around its button with it.

```vue
<FpMenu>
  <template #trigger>
    <FpButton>Source <FpIcon name="down" /></FpButton>
  </template>
  <FpMenuItem v-for="name in sources" :key="name" @select="source = name">{{ name }}</FpMenuItem>
  <FpMenuSeparator />
  <FpMenuItem disabled>Eject</FpMenuItem>
</FpMenu>
<FpLcd>
  <FpLcdLine :text="`SRC ${source}`" />
</FpLcd>
```

Its button can sit in an `FpButtonGroup`, joined to the action it offers more of:

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

**`FpMenu`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | The side of the trigger the plate drops on. It flips to the other side when there is no room. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | How the plate lines up with the trigger along that side. |
| `modal` | `boolean` | `true` | Shuts out the rest of the page while the menu is open: pointer events and scrolling outside it are blocked, and assistive tech reads only the menu. |
| `to` | `string \| HTMLElement` | `"body"` | Where the plate is mounted, a selector or an element. It takes the skin of the nearest `data-fp-skin` around the trigger with it; a custom skin set on another selector needs `to` inside that element. |
| `open` | `boolean` | `false` |  |

| Event or slot | Description |
| --- | --- |
| `@update:open` |  |
| `#trigger` | The button that opens the menu, such as an `FpButton`. It gets `aria-haspopup` and `aria-expanded`, which hold a chrome button down while the menu is open. |
| `#default` | The menu's rows: `FpMenuItem` and `FpMenuSeparator`. |

**`FpMenuItem`** · takes Reka's `as` and `asChild`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` |  | Greys the row out; it can't be chosen. |
| `textValue` | `string` |  | The text type-ahead matches, when the row's own text is not what a user would type. |

| Event or slot | Description |
| --- | --- |
| `@select` |  |
| `#default` | The content. |

## FpGelButton

The glossy gel pill, for the panel's main action. One per panel.

```vue
<FpGelButton @click="saves++"><FpIcon name="save" /> Save</FpGelButton>
<FpHousing><FpLed :key="saves" color="amber" :lit="saves > 0" blink /> SAVED</FpHousing>
```

**`FpGelButton`** · takes Reka's `as` and `asChild`

No props of its own.

| Event or slot | Description |
| --- | --- |
| `#default` | The content. |

## FpCap

A molded-plastic cap. Selection shows as pressed in with a ring, never by colour alone.

```vue
<FpCap v-for="color in caps" :key="color" :color="color" :pressed="bank === color" @click="bank = color">{{ color[0]!.toUpperCase() }}</FpCap>
```

**`FpCap`** · takes Reka's `as` and `asChild`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `FpCapColor` | `"white"` | The plastic. Each colour carries its own label colour. |
| `pressed` | `boolean` |  | Holds the cap down with a ring around it and sets `aria-pressed`. Leave it unset for a plain cap. |

| Event or slot | Description |
| --- | --- |
| `#default` | The content. |

## FpKnob

A rotary knob. Drag it up or down (hold Shift for fine moves), or use the arrow keys, PageUp and
PageDown, Home and End. `v-model` holds a number between `min` and `max`, snapped to `step`;
`valueCommit` fires when a drag ends or a key moves it. `label` puts a silkscreen label under the
knob and names it, and `valueText` says the value in words.

```vue
<FpKnob v-model="tone" label="Tone" :min="-12" :max="12" :value-text="v => `${v} dB`" />
```

**`FpKnob`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | `number` | `0` | The lowest value, at the knob's 7 o'clock stop. |
| `max` | `number` | `100` | The highest value, at its 5 o'clock stop. |
| `step` | `number` | `1` | The step values snap to. PageUp and PageDown move ten steps. |
| `label` | `string` |  | A silkscreen label under the knob, which also names it. Without one, give it an `aria-label`. |
| `valueText` | `((value: number) => string)` |  | Turns the value into the words a screen reader says, such as `v => `${v} dB``. |
| `disabled` | `boolean` |  |  |
| `modelValue` | `number` | `0` |  |

| Event or slot | Description |
| --- | --- |
| `@update:modelValue` |  |
| `@valueCommit` |  |

## FpSlider

A fader: a chrome cap that slides along a slot. Drag the cap, press the slot to move it there, or
use the arrow keys, PageUp and PageDown, Home and End. It takes the same `v-model`, `label` and
`valueText` as `FpKnob`. It stands up by default; `orientation="horizontal"` lays it on its side,
and `--fp-fader-length` sets how far it travels.

```vue
<FpSlider v-model="bass" label="Bass" :min="-12" :max="12" :value-text="v => `${v} dB`" />
```

**`FpSlider`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | `number` | `0` | The lowest value, at the bottom (or the start, lying on its side). |
| `max` | `number` | `100` | The highest value, at the top (or the end). |
| `step` | `number` | `1` | The step values snap to. PageUp, PageDown and Shift with an arrow move ten steps. |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Stands up, like a mixer channel, or lies on its side. |
| `label` | `string` |  | A silkscreen label under the fader, which also names it. Without one, give it an `aria-label`. |
| `valueText` | `((value: number) => string)` |  | Turns the value into the words a screen reader says, such as `v => `${v} dB``. |
| `disabled` | `boolean` |  |  |
| `modelValue` | `number` | `0` |  |

| Event or slot | Description |
| --- | --- |
| `@update:modelValue` |  |
| `@valueCommit` |  |

## FpSwitch

An illuminated rocker: press it, or focus it and press Space or Enter, and the I half rocks in as
the lamp behind its lens lights; off, the lamp fades out as a filament cools. `v-model` holds a
boolean and `label` names it. The lamp is red; `color` lights it green or amber.
`orientation="horizontal"` lays it on its side, O on the left and I on the right, and
`label-placement="start"` puts the label level with it, before it in the line. Only the label goes
with it: a switch is always on or off, so show a fault where the device reports one, on its readout
or an LED, as the readout here does.

```vue
<FpSwitch v-model="power" label="Power" />

<FpSwitch v-model="record" label="Rec" orientation="horizontal" label-placement="start" />
```

**`FpSwitch`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | A silkscreen label, which also names the switch. Without one, give it an `aria-label`. |
| `labelPlacement` | `"start" \| "below"` | `"below"` | Where the label sits: under the switch, or level with it and before it in the line. |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Standing up, I at the top; or on its side, I on the right. |
| `color` | `FpLedColor` | `"red"` | The colour its lamp lights in. |
| `disabled` | `boolean` |  |  |
| `modelValue` | `boolean` | `false` |  |

| Event or slot | Description |
| --- | --- |
| `@update:modelValue` |  |

## FpRadioGroup

A row of latching piano keys, after the key row on an old cassette deck: press a key and it latches
down as the last one comes up, and the arrow keys move the latch along the row. Each option is
`{ value, label, disabled?, color? }`; its `label` is printed over its key and names it, and `label`
on the group goes under the well and names the group. The strip at each key's foot is an LED that
lights while the key is latched, green unless `color`, or an option's own `color`, says otherwise.
`led="above"` puts an LED over each label instead, and `led="none"` leaves the strips as plain
plastic, so the latch alone shows the choice. `orientation="vertical"` lays the keys on their side,
stacked, each label before its key.

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

**`FpRadioGroup`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `FpKeyOption[]` |  | The keys, left to right or top to bottom. |
| `label` | `string` |  | A silkscreen label under the keys, which also names the group. Without one, give it an `aria-label`. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Keys standing side by side, or on their side and stacked. |
| `led` | `FpKeyLed` | `"strip"` | Where the light is: the strip at the foot of each key, an LED over each label, or none. |
| `color` | `FpLedColor` | `"green"` | The colour the LEDs light in, unless an option sets its own. |
| `disabled` | `boolean` |  |  |
| `modelValue` | `string` |  |  |

| Event or slot | Description |
| --- | --- |
| `@update:modelValue` |  |

## FpCheckbox and FpCheckboxGroup

Piano keys that latch on their own, like a deck's pause key: press one to latch it down, press it
again to let it up. `FpCheckbox` is one key in its own well, with a boolean `v-model` and its
`label` over it. The LED and `orientation` work as on FpRadioGroup.

```vue
<FpCheckboxGroup v-model="latched" :options="inputs" label="Input" />

<FpCheckbox v-model="paused" label="Pause" color="amber" />

<FpCheckbox v-model="muted" label="Mute" led="above" color="red" />
```

**`FpCheckbox`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | A silkscreen label over the key, which also names it. Without one, give it an `aria-label`. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Standing up, or on its side with the label before it. |
| `led` | `FpKeyLed` | `"strip"` | Where the light is: the strip at the foot of the key, an LED over the label, or none. |
| `color` | `FpLedColor` | `"green"` | The colour its LED lights in. |
| `disabled` | `boolean` |  |  |
| `modelValue` | `boolean` | `false` |  |

| Event or slot | Description |
| --- | --- |
| `@update:modelValue` |  |

`FpCheckboxGroup` sets a row of these keys in one well: `v-model` holds the values of the latched
options, and each key is still its own stop for Tab. The options, the LED and `orientation` work as
on FpRadioGroup.

**`FpCheckboxGroup`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `FpKeyOption[]` |  | The keys, left to right or top to bottom. |
| `label` | `string` |  | A silkscreen label under the keys, which also names the group. Without one, give it an `aria-label`. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Keys standing side by side, or on their side and stacked. |
| `led` | `FpKeyLed` | `"strip"` | Where the light is: the strip at the foot of each key, an LED over each label, or none. |
| `color` | `FpLedColor` | `"green"` | The colour the LEDs light in, unless an option sets its own. |
| `disabled` | `boolean` |  |  |
| `modelValue` | `string[]` | `[]` |  |

| Event or slot | Description |
| --- | --- |
| `@update:modelValue` |  |

## FpMeter

A level meter: LED segments that light green, then amber from `amberAt`, then red from `redAt`. A
segment lights once the value reaches it. Pass `value`; it can change every frame. It stands up by
default; `orientation="horizontal"` lays it on its side, and `--fp-meter-length` sets how long it
is. Name it with `label` or `aria-label`, or hide it with `aria-hidden` when a readout beside it
says the same.

```vue
<FpMeter :value="level" :min="-60" :max="0" :amber-at="-12" :red-at="-3" label="Input" />
```

**`FpMeter`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | The level to show. Values past the ends light all or none of it. |
| `min` | `number` | `0` | The level at the bottom (or the start, lying on its side). |
| `max` | `number` | `100` | The level at the top (or the end). |
| `segments` | `number` | `12` | How many LED segments it has. A segment lights once the value reaches it. |
| `amberAt` | `number` |  | Where amber begins, in the value's units. Defaults to 70 percent of the range. |
| `redAt` | `number` |  | Where red begins, in the value's units. Defaults to 90 percent of the range. |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Stands up, like a channel's level, or lies on its side. |
| `lens` | `FpLens` |  | How its segments light. Unset, it takes the lens set around it (`fp-lens-*`), else diffused. |
| `label` | `string` |  | A silkscreen label under the meter, which also names it. Without one, give it an `aria-label`. |
| `valueText` | `((value: number) => string)` |  | Turns the value into the words a screen reader says, such as `v => `${v} dB``. |

## FpReadout

A seven-segment readout: LED digits in a dark housing, with the unlit segments faintly showing.
It draws digits, a minus, a space and the letters such a display can; a `.` lights the decimal
point of the digit before it and a `:` adds a colon. `digits` pads it with dark cells on the left,
so a changing number keeps its width. Screen readers read the value as text, or the words
`valueText` gives.

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

**`FpReadout`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string \| number` |  | What it shows. Digits, a minus, a space and the letters a seven-segment display can draw; a `.` lights the decimal point of the digit before it, and a `:` adds a colon. |
| `digits` | `number` |  | How many digit cells it has, padded with dark cells on the left. Colons do not count. |
| `color` | `FpLedColor` | `"green"` | The colour its segments light in. |
| `lens` | `FpLens` |  | How its segments light. Unset, it takes the lens set around it (`fp-lens-*`), else diffused. |
| `valueText` | `((value: string) => string)` |  | Turns the value into the words a screen reader says, such as `v => `${v} dB``. |

## FpLcd and FpLcdLine

LCD glass recessed into the chrome, and a line of text on it. `ghost` shows the unlit segments
behind the text, `cells` wide; `redraw` sweeps the line left to right when its text changes.

```vue
<FpLcd>
  <FpLcdLine :text="tracks[track]!" ghost :cells="14" redraw aria-live="polite" />
</FpLcd>
<FpButton @click="track = (track + 1) % tracks.length">Next</FpButton>
```

**`FpLcd`** · takes Reka's `as` and `asChild`

No props of its own.

| Event or slot | Description |
| --- | --- |
| `#default` | The content. |

**`FpLcdLine`** · takes Reka's `as` and `asChild`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` (required) | `string` |  | The text on the glass. Readouts read best in capitals. |
| `ghost` | `boolean` |  | Shows the unlit segments behind the text, as on real glass. |
| `cells` | `number` |  | The line's width in character cells, which the ghost segments fill. Defaults to the text's length. |
| `redraw` | `boolean` |  | Redraws the line left to right whenever its text changes, as a display does. |

## FpLed

A green, amber or red LED. It is decorative unless given a `label`: say what it means in text
nearby. `blink` blinks it twice when it lights; re-key it to blink again.

```vue
<FpHousing><FpLed lit /> ON</FpHousing>
<FpHousing><FpLed color="amber" lit /> REC</FpHousing>
<FpHousing><FpLed color="red" lit /> CLIP</FpHousing>
<FpHousing><FpLed /> OFF</FpHousing>
```

**`FpLed`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `FpLedColor` | `"green"` | The colour it lights in. |
| `lit` | `boolean` |  | Lights the LED, with a glow. |
| `blink` | `boolean` |  | Blinks twice when it lights, then holds, to confirm an action. Re-key the LED to blink again. |
| `lens` | `FpLens` |  | How its light spreads. Unset, it takes the lens set around it (`fp-lens-*`), else diffused. |
| `label` | `string` |  | Announces the LED as an image with this name. Without it the LED is decorative: say its state in text nearby. |

## Lenses

A real LED has its chip in the middle of the segment, under a diffusing lens, so it is brightest
there. The lens sets how strong that is, for `FpLed`, `FpMeter` and `FpReadout`:
`fp-lens-diffused`, the default, gives a soft hot spot; `fp-lens-clear` a bright core and a wider
glow; `fp-lens-flat` an even fill. Put a lens class on any element to set every LED part inside
it, a whole device at once, or pass a part its own `lens`.

```vue
<FpDevice class="fp-lens-clear">
  <FpReadout :value="time" />            <!-- clear, from the device -->
  <FpLed lit lens="flat" />              <!-- its own lens -->
</FpDevice>
```

## FpHousing, FpWell, FpSilk and FpScrew

A dark housing for LEDs and small readouts, a recessed well, a silkscreened label and a screw
head. Render `FpSilk` as a heading or `label` where it names something.

```vue
<FpScrew />
<FpSilk>Silkscreen</FpSilk>
<FpHousing>HOUSING</FpHousing>
<FpWell>Well</FpWell>
<FpScrew />
```

**`FpHousing`** · takes Reka's `as` and `asChild`

No props of its own.

| Event or slot | Description |
| --- | --- |
| `#default` | The content. |

## FpIcon

A 16 px pixel icon. It is decorative unless given a `label`; on an icon-only button, put
`aria-label` on the button instead.

```vue
<span v-for="name in fpIconNames" :key="name">
  <FpIcon :name="name" />
  <code>{{ name }}</code>
</span>
```

**`FpIcon`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `FpIconName` |  | Which glyph, one of `fpIconNames`. |
| `label` | `string` |  | Announces the icon as an image with this name, for an icon that stands alone. |
