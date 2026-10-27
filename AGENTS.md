# AGENTS.md

Frontpanel is an early-2000s hardware UI kit: liquid-chrome bezels, gel buttons, LCD readouts and
LEDs, as plain CSS with Vue 3 components on top. It builds device front panels, not a general UI
framework or a theme for ordinary websites. The device is the unit.

- TypeScript stays on 6.x: `vue-tsc` and typescript-eslint need the classic compiler API, which
  TypeScript 7 does not ship. Fix a type error in the code.
- Describe the look in our own words ("early-2000s hardware"); never use other products' names,
  logos or artwork.
- Record user-facing changes with `pnpm changeset`.
- Before you build or change a stylesheet or component in any package, read
  [CODING_STANDARDS.md](CODING_STANDARDS.md).
