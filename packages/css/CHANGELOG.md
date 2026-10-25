# @frontpanel/css

## 0.4.0

### Minor Changes

- 78c0e86: A faceplate menu and joined buttons. In the CSS, `fp-menu` is a small brushed-chrome plate that drops in on `data-state="open"`, holding `fp-menu-item` rows, which press into the plate when `data-highlighted`, and `fp-menu-separator` grooves; `fp-button-group` joins `fp-chrome-btn` buttons side by side into one bezel. In Vue, `FpMenu` puts Reka's DropdownMenu behind a `trigger` slot, with `side`, `align`, `modal`, `to` and `v-model:open`, and carries the skin around its trigger to the plate; `FpMenuItem` emits `select` and takes `as`, `disabled` and `textValue`; `FpMenuSeparator` divides the rows. `FpButtonGroup` is a named `role="group"` around joined buttons, so a menu's button can sit beside the action it offers more of.

## 0.3.0

### Minor Changes

- 71c32e0: An illuminated rocker switch. In the CSS, `fp-switch` goes on a button with `role="switch"` and `aria-checked`, holding an `fp-switch-rocker` with an `fp-switch-lamp` and an `fp-switch-face`: on, the I half rocks in and the lamp lights; off, the lamp fades out. The lamp is red, or green or amber with `fp-led-green` or `fp-led-amber`. `data-orientation="horizontal"` lays it on its side, I on the right. `fp-unit` takes `data-label-placement="start"` to set the label level with any control, before it. In Vue, `FpSwitch` takes a boolean `v-model`, `label`, `labelPlacement` (`below` or `start`), `orientation` and `color`, on Reka's Switch.

### Patch Changes

- 9649b34: The rest of the kit holds up with forced colours (such as Windows high contrast). The knob and fader, which vanished, are drawn in outlines with their mark and grip line. Chrome and gel buttons, caps, modules, wells, housings, the LCD and the device rim, and in the page extra the sheet panel, keep an edge, where before they lost it; a pressed button or selected cap is filled with the system's selected colour, where before it looked like the others; and a disabled button is greyed rather than faded. An LCD's unlit segments are hidden instead of printing as solid as the text.

## 0.2.0

### Minor Changes

- 360e040: Add `FpSlider`, a fader on Reka's Slider: a chrome cap on a recessed slot, standing up or lying on its side (`orientation`). It takes the same `v-model` number, `min`, `max`, `step`, `label`, `valueText` and `valueCommit` as `FpKnob`; drag the cap, press the slot to move it there, or use the arrow keys, PageUp, PageDown, Home and End. A press focuses the cap without lighting its focus ring. The look ships as `fp-fader`, `fp-fader-slot` and `fp-fader-cap` in `@frontpanel/css`, with `--fp-fader-length` for its travel.
- eae7a80: Add `FpKnob`, a rotary knob: `v-model` with `min`, `max` and `step`, turned by dragging up and down (Shift for fine moves) or with the arrow keys, PageUp, PageDown, Home and End, as an ARIA slider. `label` adds a silkscreen label that names it, `valueText` reads the value out in words, and `valueCommit` fires when a drag ends or a key moves it. The look ships as `fp-knob` and `fp-knob-mark` in `@frontpanel/css`, with `fp-unit` to set a control over its label.
- a9ad307: Add LED lenses. A lit LED is now brightest over its chip, in the middle, like a real one: `fp-lens-diffused` (the default) gives a soft hot spot, `fp-lens-clear` a bright core and a wider glow, and `fp-lens-flat` an even fill, which is how `fp-led` looked in 0.1.0. A lens class works on one part or on any element around it, such as a device body, to set every LED inside. Meter segments light the same way, with a little light spilling into the gaps beside them. `FpLed`, `FpMeter` and `FpReadout` take a `lens` prop; unset, they follow the lens around them.
- f4444c2: Add `FpMeter`, a level meter: LED segments that light green, then amber from `amberAt`, then red from `redAt`, standing up or lying on its side. A segment lights once `value` reaches it. It is a `role="meter"` with `label` and `valueText`, like `FpKnob` and `FpSlider`. The look ships as `fp-meter` in `@frontpanel/css`, driven by `--fp-meter-level`, `--fp-meter-segments`, `--fp-meter-amber`, `--fp-meter-red` and `--fp-meter-length`, so it works without Vue and updates every frame by one style change.
- 3ebd632: Add `FpReadout`, a seven-segment LED readout: digits, a minus and the letters such a display can draw, with `.` lighting the previous digit's decimal point and `:` adding a colon. `digits` pads it with dark cells so a changing number keeps its width, `color` lights it green, amber or red, and screen readers read the value as text (or `valueText`'s words). The digits sit on a near-black face in the housing, glow onto it, and pass as text at any size. The look ships as `fp-readout`, `fp-readout-cell`, `fp-readout-lit` and `fp-readout-text` in `@frontpanel/css`, coloured by `fp-led-amber` and `fp-led-red`; without Vue, `fpReadoutGlyph` names the segments each character lights.
- db7d8e3: Each skin sets `--fp-scheme` (`light` or `dark`), and the device surfaces (`fp-device-backdrop`, `fp-device-rim`, `fp-device-body`, `fp-module`, `fp-well`, `fp-scroll-thin`, and the page extra's `fp-sheet-panel` and `fp-field`) wear it as their `color-scheme`, so native scrollbars and controls inside a device match its skin, including a skin forced on a nested element. `base.css` sets the root from the same variable. A custom dark skin should set `--fp-scheme: dark`.

### Patch Changes

- 7553464: Gunmetal's ring around a selected cap is the skin's light ink (`#e7eaf0`) instead of amber, which clashed with the cap colours and disappeared on the amber cap. Both skins now mark a selected cap with their ink colour.
- f076694: LEDs and meters stay visible with forced colours (such as Windows high contrast): an unlit LED is an outlined ring and a lit one is filled, and a meter shows as an outlined strip with its lit segments filled. Before, both disappeared.
- 1c3f8c1: Silver's focus ring is the gel blue (`#1a56b0`) instead of a near-black navy, so focus reads as the kit's one accent. It keeps 3:1 on every surface it sits on, the page backdrop included.

## 0.1.0

First release: an early-2000s hardware skin for device front panels.

- The Chrome Silver and Gunmetal Night tokens (`--fp-*`), following the system setting or forced
  with `data-fp-skin`. Every text pairing passes WCAG AA in both.
- The `.fp-*` classes: device backdrop, rim and body; chrome, push buttons, gel buttons and molded
  caps (`fp-cap-blue`, `-amber`, `-graphite`, `-berry`); modules and windows with chrome title
  bars; wells, housings, silkscreen labels and screws; LCD glass and lines with unlit segments;
  LEDs; a thin scrollbar; pixel icons. Each interactive class carries its own focus ring and
  reduced-motion handling. Controls are 44 px, and 36 px under a precise pointer.
- Plain CSS in `@layer frontpanel` (`index.css`, `tokens.css`, `components.css`), and a Tailwind 4
  entry (`tailwind.css`) that maps the tokens into the theme and declares the classes as
  utilities, so variants like `lg:fp-module` work.
- An opt-in page extra for websites around a device: `page.css` / `tailwind-page.css` (a text
  field and a phone bottom sheet) and the page defaults in `base.css` / `tailwind-base.css`.
- `fonts.css` with Michroma and VT323, self-hosted woff2 under the SIL Open Font License.
