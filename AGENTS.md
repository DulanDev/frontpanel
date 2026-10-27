# AGENTS.md

Frontpanel is an early-2000s hardware UI kit: liquid-chrome bezels, gel buttons, LCD readouts and
LEDs, as plain CSS with Vue 3 components on top. It builds device front panels, not a general UI
framework or a theme for ordinary websites. The device is the unit.

## Toolchain

TypeScript stays on 6.x: `vue-tsc` and typescript-eslint need the classic compiler API, which
TypeScript 7 does not ship. Fix a type error in the code.

## Guardrails

- Describe the look in our own words ("early-2000s hardware"); never use other products' names,
  logos or artwork.
- Record user-facing changes with `pnpm changeset`.

## Standards

Before you act on one of these, read the named sections of `CODING_STANDARDS.md`:

- Edit CSS under `packages/css/src`: [Device model](CODING_STANDARDS.md#device-model),
  [Light and skins](CODING_STANDARDS.md#light-and-skins),
  [Layout and sizing](CODING_STANDARDS.md#layout-and-sizing), [Motion](CODING_STANDARDS.md#motion).
- Write or change a `.vue` component: [Device model](CODING_STANDARDS.md#device-model),
  [Components](CODING_STANDARDS.md#components), [Motion](CODING_STANDARDS.md#motion).
- Touch `packages/music`: [Music package](CODING_STANDARDS.md#music-package).
