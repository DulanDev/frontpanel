# @frontpanel/vue

Behaviour and ARIA come from Reka UI; Frontpanel supplies the skin. Hand-roll only what Reka lacks
(the knob, the LCD readout).

Every component gets a fixture in `src/components.a11y.test.ts`: axe scans it in Chromium, in both
skins, and a guard test fails for an exported component with none. It covers shipped components
only, not the docs demos. Run `pnpm --filter @frontpanel/vue exec playwright install chromium`
once before `pnpm test`. Turn a rule off only for one fixture, where Reka UI owns the markup, with
the reason and a link beside it.
