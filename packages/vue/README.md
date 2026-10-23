# @frontpanel/vue

Vue 3 components for the Frontpanel early-2000s hardware skin: a device frame that can scale to
fit, windows, chrome and gel buttons, molded caps, LCD lines, LEDs and a pixel icon set. Behaviour
and ARIA come from [Reka UI](https://reka-ui.com); the look comes from
[`@frontpanel/css`](https://www.npmjs.com/package/@frontpanel/css).

The UI kit behind [WhatsTheNextChord](https://whatsthenextchord.com).

**[Documentation](https://dulandev.github.io/frontpanel/)**: guides, live demos, and every
component, class and token.

> `0.x`: props may still change between minor versions. Pin the version.

## Install

```bash
npm install @frontpanel/vue
```

It needs Vue 3.5 or later. `@frontpanel/css` comes with it; the components ship no CSS of their
own, so import the stylesheet once:

```ts
import '@frontpanel/css/index.css'
import '@frontpanel/css/fonts.css' // optional: the display and LCD fonts
```

With Tailwind 4, import `@frontpanel/css/tailwind.css` instead (see its README), and add an
`@source` line for this package. Tailwind doesn't scan `node_modules`, so without it the classes
the components use are never generated. Give the path from your CSS file:

```css
@source "../node_modules/@frontpanel/vue/dist";
```

## Example

```vue
<script setup lang="ts">
import { FpButton, FpDevice, FpGelButton, FpLcd, FpLcdLine, FpLed, FpWindow } from '@frontpanel/vue'
import { ref } from 'vue'

const playing = ref(false)
</script>

<template>
  <FpDevice fit="width" :width="600">
    <FpWindow title="Deck">
      <FpLcd>
        <FpLcdLine :text="playing ? 'PLAYING' : 'STOPPED'" ghost :cells="12" redraw />
      </FpLcd>
      <FpLed :lit="playing" color="amber" />
      <FpButton :pressed="playing" @click="playing = !playing">
        Play
      </FpButton>
      <FpGelButton>Save</FpGelButton>
    </FpWindow>
  </FpDevice>
</template>
```

## Components

| Component | What it is |
| --- | --- |
| `FpDevice` | The device: a molded body in a liquid-chrome rim on a backdrop. `fit="width"` or `"contain"` draws it at a design `width` and scales it to the room it has; the default `fit="none"` leaves layout to your page |
| `FpWindow` | A matte module with a chrome title bar: `title`, `level`, `closable` (emits `close`), an `actions` slot, and `sheet` for a phone bottom sheet |
| `FpButton` | A brushed-chrome push button; `pressed` makes it a toggle |
| `FpButtonGroup` | Chrome buttons joined into one bezel, as a named group |
| `FpMenu`, `FpMenuItem`, `FpMenuSeparator` | A faceplate menu that drops from the button in its `trigger` slot; rows emit `select`, or are links with `as="a"` |
| `FpGelButton` | The glossy gel pill, for the panel's main action |
| `FpCap` | A molded-plastic cap in `white`, `blue`, `amber`, `graphite` or `berry`; `pressed` holds it down with a ring |
| `FpLcd`, `FpLcdLine` | LCD glass, and a line of text on it with optional unlit segments (`ghost`, `cells`) and a left-to-right `redraw` |
| `FpLed` | A `green`, `amber` or `red` LED; `lit`, and `blink` to confirm an action |
| `FpHousing`, `FpWell`, `FpSilk`, `FpScrew` | A dark housing for LEDs, a recessed well, a silkscreened label, a screw head |
| `FpIcon` | A 20-glyph 16 px pixel icon set (`fpIconNames`) |

Element components take Reka's `as` and `asChild`.

## Accessibility

- **LEDs and icons are decorative** (`aria-hidden`) unless you give them a `label`, which makes
  them an image with that name. Say an LED's state in text nearby, or label it; colour alone
  never carries meaning.
- **An icon-only button needs a name.** Put `aria-label` on the `FpButton` and leave the
  `FpIcon` inside it decorative.
- **`pressed` makes a toggle.** On `FpButton` and `FpCap` it sets `aria-pressed` and holds the
  control down; leave it unset for an ordinary button, which then gets no `aria-pressed`.
- **Closing an `FpWindow` removes the focused close button.** Move focus back to the control
  that opened the window.
- **`FpSilk` is a span.** Render it as a heading or `label` (`as="h3"`, `as="label"`) where it
  names something.
- Every control shows a focus ring, every text colour pairing passes WCAG AA in both skins, and
  each moving part respects `prefers-reduced-motion`.

## Licence

MIT.
