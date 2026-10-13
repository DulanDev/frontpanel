# CLAUDE.md

Frontpanel is an early-2000s hardware UI kit: liquid-chrome bezels, gel buttons, LCD readouts and
LEDs, as plain CSS with Vue 3 components on top. MIT licence.

It is for building device front panels in the style of early-2000s media players and hardware,
not a general UI framework or a theme for ordinary websites. The device is the unit: a chassis of
modules and display windows with physical controls (knobs, faders, switches, buttons with LEDs,
readouts, meters); state shows physically (a pressed bevel, a lit LED); text is silkscreened
labels and readouts. Overlays are device parts (a window, a faceplate menu, an LCD tag).

## Layout

pnpm workspace: `packages/css` (`@frontpanel/css`), `packages/vue` (`@frontpanel/vue`),
`packages/music` (`@frontpanel/music`), `apps/showcase` (private, GitHub Pages at `/frontpanel/`).
Commands are in `README.md`. TypeScript stays on 6.x: `vue-tsc` and typescript-eslint need the
classic compiler API, which TypeScript 7 does not ship. Never fix a type error by bumping it.

## Rules

- Every class is `.fp-*` and every token `--fp-*`. In the plain CSS, classes and tokens sit in
  `@layer frontpanel`; the Tailwind entry puts them in Tailwind's own layers (tokens in `theme`,
  classes as `@utility`) so its utilities still win.
- Layout is the developer's choice: a device may scale as a whole or reflow its modules at their
  own breakpoints, and Frontpanel must allow both. Core classes carry no viewport breakpoints;
  control sizes follow the input (44 px by default, 36 px under `pointer: fine`), and modules
  size to their container.
- Website-only pieces (the text field, the phone bottom sheet, page defaults) live in the opt-in
  page extra (`page.css`, `tailwind-page.css`, `base.css`, `tailwind-base.css`), never in the
  core entries.
- No global side effects outside `base.css` (and its Tailwind twin) and `fonts.css`, all opt-in.
  Reduced motion is handled per component, not by a global `*` reset.
- `tokens.css`, `components.css`, `tailwind.css`, `page.css`, `tailwind-page.css`, `base.css` and
  `tailwind-base.css` are generated from `packages/css/src/` by `pnpm build` so they cannot drift;
  never edit one by hand.
- One light source, top-left: bevels are light on top and left, and invert when pressed. Every text
  pairing must pass WCAG AA in both skins.
- Behaviour and ARIA come from Reka UI; Frontpanel supplies the skin. Hand-roll only what Reka lacks
  (the knob, the LCD readout).
- `@frontpanel/music` is presentational: it takes plain data (frets, strings, labels) and ships no
  music-theory engine or chord data.
- Describe the look in our own words ("early-2000s hardware"); never use other products' names,
  logos or artwork.
- `<script setup lang="ts">` in every SFC, never a second `<script>` block.
- Record user-facing changes with `pnpm changeset`.
