---
'@frontpanel/css': minor
'@frontpanel/vue': minor
---

An illuminated rocker switch. In the CSS, `fp-switch` goes on a button with `role="switch"` and `aria-checked`, holding an `fp-switch-rocker` with an `fp-switch-lamp` and an `fp-switch-face`: on, the I half rocks in and the lamp lights; off, the lamp fades out. The lamp is red, or green or amber with `fp-led-green` or `fp-led-amber`. `data-orientation="horizontal"` lays it on its side, I on the right. `fp-unit` takes `data-label-placement="start"` to set the label level with any control, before it. In Vue, `FpSwitch` takes a boolean `v-model`, `label`, `labelPlacement` (`below` or `start`), `orientation` and `color`, on Reka's Switch.
