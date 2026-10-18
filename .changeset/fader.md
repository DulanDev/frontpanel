---
'@frontpanel/css': minor
'@frontpanel/vue': minor
---

Add `FpSlider`, a fader on Reka's Slider: a chrome cap on a recessed slot, standing up or lying on its side (`orientation`). It takes the same `v-model` number, `min`, `max`, `step`, `label`, `valueText` and `valueCommit` as `FpKnob`; drag the cap, press the slot to move it there, or use the arrow keys, PageUp, PageDown, Home and End. A press focuses the cap without lighting its focus ring. The look ships as `fp-fader`, `fp-fader-slot` and `fp-fader-cap` in `@frontpanel/css`, with `--fp-fader-length` for its travel.
