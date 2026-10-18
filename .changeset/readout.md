---
'@frontpanel/css': minor
'@frontpanel/vue': minor
---

Add `FpReadout`, a seven-segment LED readout: digits, a minus and the letters such a display can draw, with `.` lighting the previous digit's decimal point and `:` adding a colon. `digits` pads it with dark cells so a changing number keeps its width, `color` lights it green, amber or red, and screen readers read the value as text (or `valueText`'s words). The digits sit on a near-black face in the housing, glow onto it, and pass as text at any size. The look ships as `fp-readout`, `fp-readout-cell`, `fp-readout-lit` and `fp-readout-text` in `@frontpanel/css`, coloured by `fp-led-amber` and `fp-led-red`; without Vue, `fpReadoutGlyph` names the segments each character lights.
