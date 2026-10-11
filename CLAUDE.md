# CLAUDE.md

Frontpanel is an early-2000s hardware UI kit: liquid-chrome bezels, gel buttons, LCD readouts and
LEDs, as plain CSS with Vue 3 components on top. MIT licence.

## Layout

pnpm workspace: `packages/css` (`@frontpanel/css`), `packages/vue` (`@frontpanel/vue`),
`packages/music` (`@frontpanel/music`), `apps/showcase` (private, GitHub Pages at `/frontpanel/`).
Commands are in `README.md`. TypeScript stays on 6.x: `vue-tsc` and typescript-eslint need the
classic compiler API, which TypeScript 7 does not ship. Never fix a type error by bumping it.

## Rules

- Every class is `.fp-*` and every token `--fp-*`; classes sit in `@layer frontpanel`.
- No global side effects outside `base.css` and `fonts.css`, both opt-in. Reduced motion is handled
  per component, not by a global `*` reset.
- `components.css` and `tailwind.css` are generated from one source so they cannot drift; never
  edit one by hand.
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
