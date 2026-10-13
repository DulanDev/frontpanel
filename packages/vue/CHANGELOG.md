# @frontpanel/vue

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
