# Coding standards

Authoring rules for the CSS in `packages/css/src` and the components in `packages/vue` and
`packages/music`. Each section stands alone; read the ones `AGENTS.md` names for your task.

## Device model

A device is a chassis of modules and display windows. Physical controls carry the interaction:
knobs, faders, switches, buttons with LEDs, readouts, meters. State shows physically (a pressed
bevel, a lit LED). Text is silkscreened labels and readouts. Overlays are device parts: a window, a
faceplate menu, an LCD tag.

## Light and skins

One light source, top-left: bevels are light on top and left, and invert when pressed.

List each new colour pairing in `packages/css/src/contrast-pairs.ts`; the contrast test holds it to
WCAG AA in both skins.

## Layout and sizing

Layout is the developer's choice: a device may scale as a whole or reflow its modules at their own
breakpoints, and Frontpanel must allow both. Control sizes follow the input (44 px by default, 36 px
under `pointer: fine`), and modules size to their container.

Website-only pieces (the text field, the phone bottom sheet, page defaults) go in the opt-in page
extra (`packages/css/src/page`), outside the core entries.

## Motion

Handle reduced motion inside each component.

## Components

Behaviour and ARIA come from Reka UI; Frontpanel supplies the skin. Hand-roll only what Reka lacks
(the knob, the LCD readout).

Every SFC has one `<script setup lang="ts">` block and no other `<script>`.

## Music package

`@frontpanel/music` is presentational: it takes plain data (frets, strings, labels), and music
theory and chord data stay with the caller.
