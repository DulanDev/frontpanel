---
'@frontpanel/css': minor
'@frontpanel/vue': minor
---

Add `FpMeter`, a level meter: LED segments that light green, then amber from `amberAt`, then red from `redAt`, standing up or lying on its side. A segment lights once `value` reaches it. It is a `role="meter"` with `label` and `valueText`, like `FpKnob` and `FpSlider`. The look ships as `fp-meter` and `fp-meter-unit` in `@frontpanel/css`, driven by `--fp-meter-level`, `--fp-meter-segments`, `--fp-meter-amber`, `--fp-meter-red` and `--fp-meter-length`, so it works without Vue and updates every frame by one style change.
