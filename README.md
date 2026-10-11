# Frontpanel

An early-2000s hardware UI kit for building device front panels in the browser: liquid-chrome
bezels, glossy gel buttons, knobs, LCD readouts and LEDs, in plain CSS with Vue 3 components on
top. Two skins, Chrome Silver and Gunmetal Night, follow the system setting.

The UI kit behind [WhatsTheNextChord](https://whatsthenextchord.com).

> Pre-release. Nothing is published yet; the packages below are placeholders until v1.

| Package | What it is |
| --- | --- |
| `@frontpanel/css` | Tokens, `.fp-*` classes, optional base styles, fonts and a Tailwind 4 entry |
| `@frontpanel/vue` | Vue 3 components built on [Reka UI](https://reka-ui.com) |
| `@frontpanel/music` | Optional add-on: chord diagram, chord matrix, chord-type caps |

## Development

```bash
pnpm install                              # Node >= 22, pnpm 10
pnpm lint / pnpm typecheck / pnpm test
pnpm build                                # every package and the showcase
pnpm --filter @frontpanel/showcase dev    # showcase dev server
pnpm changeset                            # record a user-facing change
```

## Licence

MIT. The bundled Michroma and VT323 fonts are under the SIL Open Font License; their licence texts
ship beside them.
