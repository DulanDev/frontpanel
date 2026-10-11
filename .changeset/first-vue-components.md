---
'@frontpanel/vue': minor
'@frontpanel/css': minor
---

Add the first Vue components: `FpDevice`, `FpWindow`, `FpButton`, `FpGelButton`, `FpCap`, `FpLcd` and `FpLcdLine`, `FpLed`, `FpHousing`, `FpWell`, `FpSilk`, `FpScrew` and `FpIcon` with an 18-glyph 16 px pixel set. `FpDevice` can scale a device drawn at a fixed design size to fit the width it has, or both sides (`fit="width"` / `fit="contain"`); without `fit`, the page lays the device out. The components wear the `@frontpanel/css` classes and ship no CSS of their own. The CSS gains the classes they use: `fp-window` (a title bar that stays in view, with small buttons under a precise pointer), `fp-window-title`, `fp-window-body`, `fp-lcd-line` and `fp-lcd-ghost` (unlit segments behind LCD text) and `fp-icon`; a body inside `fp-device-rim` now follows the rim's curve and clips to it.
