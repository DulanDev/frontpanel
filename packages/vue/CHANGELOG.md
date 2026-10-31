# @frontpanel/vue

## 0.5.0

### Minor Changes

- 01144e9: `FpRadioGroup`, `FpCheckbox` and `FpCheckboxGroup`: latching piano keys on Reka's RadioGroup, Checkbox and CheckboxGroup. Each takes `options` of `{ value, label, disabled?, color? }` (`FpCheckbox` takes one `label`), a `label` for the group, `orientation`, `color` and `led`: `strip` (the default) lights the strip on the latched key, `above` puts an LED over each label, `none` has no light. `FpRadioGroup` binds the chosen value, `FpCheckboxGroup` the latched values, `FpCheckbox` a boolean.

### Patch Changes

- Updated dependencies [6c7bf37]
  - @frontpanel/css@0.5.0

## 0.4.0

### Minor Changes

- 78c0e86: The pixel icon set gains `down`, a chevron pointing down, for the button that opens a menu.
- 78c0e86: A faceplate menu and joined buttons. In the CSS, `fp-menu` is a small brushed-chrome plate that drops in on `data-state="open"`, holding `fp-menu-item` rows, which press into the plate when `data-highlighted`, and `fp-menu-separator` grooves; `fp-button-group` joins `fp-chrome-btn` buttons side by side into one bezel. In Vue, `FpMenu` puts Reka's DropdownMenu behind a `trigger` slot, with `side`, `align`, `modal`, `to` and `v-model:open`, and carries the skin around its trigger to the plate; `FpMenuItem` emits `select` and takes `as`, `disabled` and `textValue`; `FpMenuSeparator` divides the rows. `FpButtonGroup` is a named `role="group"` around joined buttons, so a menu's button can sit beside the action it offers more of.
- 28eb670: The pixel icon set gains `power`, the power symbol (a ring broken by a bar), to silkscreen beside a power switch.

### Patch Changes

- Updated dependencies [78c0e86]
  - @frontpanel/css@0.4.0

## 0.3.0

### Minor Changes

- 71c32e0: An illuminated rocker switch. In the CSS, `fp-switch` goes on a button with `role="switch"` and `aria-checked`, holding an `fp-switch-rocker` with an `fp-switch-lamp` and an `fp-switch-face`: on, the I half rocks in and the lamp lights; off, the lamp fades out. The lamp is red, or green or amber with `fp-led-green` or `fp-led-amber`. `data-orientation="horizontal"` lays it on its side, I on the right. `fp-unit` takes `data-label-placement="start"` to set the label level with any control, before it. In Vue, `FpSwitch` takes a boolean `v-model`, `label`, `labelPlacement` (`below` or `start`), `orientation` and `color`, on Reka's Switch.
- 5251b34: The pixel icon set gains `play`, the filled triangle of a player's play key, so a transport's Play button no longer has to borrow the `go` arrow.

### Patch Changes

- Updated dependencies [9649b34]
- Updated dependencies [71c32e0]
  - @frontpanel/css@0.3.0

## 0.2.0

### Minor Changes

- 360e040: Add `FpSlider`, a fader on Reka's Slider: a chrome cap on a recessed slot, standing up or lying on its side (`orientation`). It takes the same `v-model` number, `min`, `max`, `step`, `label`, `valueText` and `valueCommit` as `FpKnob`; drag the cap, press the slot to move it there, or use the arrow keys, PageUp, PageDown, Home and End. A press focuses the cap without lighting its focus ring. The look ships as `fp-fader`, `fp-fader-slot` and `fp-fader-cap` in `@frontpanel/css`, with `--fp-fader-length` for its travel.
- eae7a80: Add `FpKnob`, a rotary knob: `v-model` with `min`, `max` and `step`, turned by dragging up and down (Shift for fine moves) or with the arrow keys, PageUp, PageDown, Home and End, as an ARIA slider. `label` adds a silkscreen label that names it, `valueText` reads the value out in words, and `valueCommit` fires when a drag ends or a key moves it. The look ships as `fp-knob` and `fp-knob-mark` in `@frontpanel/css`, with `fp-unit` to set a control over its label.
- a9ad307: Add LED lenses. A lit LED is now brightest over its chip, in the middle, like a real one: `fp-lens-diffused` (the default) gives a soft hot spot, `fp-lens-clear` a bright core and a wider glow, and `fp-lens-flat` an even fill, which is how `fp-led` looked in 0.1.0. A lens class works on one part or on any element around it, such as a device body, to set every LED inside. Meter segments light the same way, with a little light spilling into the gaps beside them. `FpLed`, `FpMeter` and `FpReadout` take a `lens` prop; unset, they follow the lens around them.
- f4444c2: Add `FpMeter`, a level meter: LED segments that light green, then amber from `amberAt`, then red from `redAt`, standing up or lying on its side. A segment lights once `value` reaches it. It is a `role="meter"` with `label` and `valueText`, like `FpKnob` and `FpSlider`. The look ships as `fp-meter` in `@frontpanel/css`, driven by `--fp-meter-level`, `--fp-meter-segments`, `--fp-meter-amber`, `--fp-meter-red` and `--fp-meter-length`, so it works without Vue and updates every frame by one style change.
- 3ebd632: Add `FpReadout`, a seven-segment LED readout: digits, a minus and the letters such a display can draw, with `.` lighting the previous digit's decimal point and `:` adding a colon. `digits` pads it with dark cells so a changing number keeps its width, `color` lights it green, amber or red, and screen readers read the value as text (or `valueText`'s words). The digits sit on a near-black face in the housing, glow onto it, and pass as text at any size. The look ships as `fp-readout`, `fp-readout-cell`, `fp-readout-lit` and `fp-readout-text` in `@frontpanel/css`, coloured by `fp-led-amber` and `fp-led-red`; without Vue, `fpReadoutGlyph` names the segments each character lights.
- 322dd53: `FpWindow` takes `as`, to render as an `aside` or another element instead of a `section`, and `flush`, which leaves the body unpadded for contents that run edge to edge.

### Patch Changes

- Updated dependencies [360e040]
- Updated dependencies [7553464]
- Updated dependencies [eae7a80]
- Updated dependencies [f076694]
- Updated dependencies [a9ad307]
- Updated dependencies [f4444c2]
- Updated dependencies [3ebd632]
- Updated dependencies [1c3f8c1]
- Updated dependencies [db7d8e3]
  - @frontpanel/css@0.2.0

## 0.1.0

First release: Vue 3 components for the Frontpanel skin, built on Reka UI.

- `FpDevice`: the backdrop, rim and body, with scale-to-fit (`fit="width"` or `"contain"` at a
  design `width`), or layout left to the page.
- `FpWindow`: a module with a chrome title bar, an optional close button and actions slot, and a
  phone bottom-sheet look.
- `FpButton`, `FpGelButton` and `FpCap`, with `pressed` for toggles.
- `FpLcd` and `FpLcdLine` (unlit segments, left-to-right redraw), `FpLed` (green, amber, red, a
  confirming double blink), `FpHousing`, `FpWell`, `FpSilk`, `FpScrew`, and `FpIcon` with an
  18-glyph 16 px pixel set.
- The components wear the `@frontpanel/css` classes and ship no CSS of their own. Element
  components take Reka's `as` and `asChild`.
- Updated dependencies
  - @frontpanel/css@0.1.0
