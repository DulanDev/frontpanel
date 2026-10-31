# AGENTS.md

Frontpanel is an early-2000s hardware UI kit: liquid-chrome bezels, gel buttons, LCD readouts and
LEDs, as plain CSS with Vue 3 components on top. It builds device front panels, not a general UI
framework or a theme for ordinary websites. The device is the unit.

- TypeScript stays on 6.x: `vue-tsc` and typescript-eslint need the classic compiler API, which
  TypeScript 7 does not ship. Fix a type error in the code.
- Describe the look in our own words ("early-2000s hardware"); never use other products' names,
  logos or artwork.
- Record user-facing changes in `.changeset/<topic>.md`: frontmatter `'@frontpanel/vue': minor`,
  then one paragraph for the changelog.
- Before you build or change a stylesheet or component, read
  [CODING_STANDARDS.md](CODING_STANDARDS.md) and the `AGENTS.md` of the package you're changing.
- Done means `pnpm lint`, `pnpm build`, `pnpm typecheck` and `pnpm test` pass, in that order (the
  docs typecheck against the built `@frontpanel/vue`), with the regenerated CSS committed beside its
  source.
