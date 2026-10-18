---
'@frontpanel/css': minor
'@frontpanel/vue': minor
---

Add LED lenses. A lit LED is now brightest over its chip, in the middle, like a real one: `fp-lens-diffused` (the default) gives a soft hot spot, `fp-lens-clear` a bright core and a wider glow, and `fp-lens-flat` an even fill, which is how `fp-led` looked in 0.1.0. A lens class works on one part or on any element around it, such as a device body, to set every LED inside. Meter segments light the same way, with a little light spilling into the gaps beside them. `FpLed` and `FpMeter` take a `lens` prop; unset, they follow the lens around them.
