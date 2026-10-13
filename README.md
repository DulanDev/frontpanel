# Frontpanel

An early-2000s hardware UI kit for building device front panels in the browser: liquid-chrome
bezels, glossy gel buttons, molded caps, LCD readouts and LEDs, in plain CSS with Vue 3
components on top. Two skins, Chrome Silver and Gunmetal Night, follow the system setting.

The UI kit behind [WhatsTheNextChord](https://whatsthenextchord.com).

> `0.x`, before 1.0: class names, tokens and props may still change between minor versions.

| Package | What it is |
| --- | --- |
| `@frontpanel/css` | Tokens, `.fp-*` classes, optional base styles, fonts and a Tailwind 4 entry |
| `@frontpanel/vue` | Vue 3 components built on [Reka UI](https://reka-ui.com) |
| `@frontpanel/music` | Coming: chord diagram, chord matrix, chord-type caps |

## Usage

Plain CSS, everything in `@layer frontpanel`:

```css
@import "@frontpanel/css/index.css";  /* tokens and .fp-* classes */
@import "@frontpanel/css/fonts.css";  /* optional: the bundled fonts */
@import "@frontpanel/css/page.css";   /* optional: website pieces around a device */
@import "@frontpanel/css/base.css";   /* optional: page defaults */
```

Tailwind 4, where the tokens join the theme and the classes become utilities:

```css
@import "tailwindcss";
@import "@frontpanel/css/tailwind.css";
@import "@frontpanel/css/tailwind-page.css";  /* optional */
@import "@frontpanel/css/tailwind-base.css";  /* optional, and with no layer() */
@source "../node_modules/@frontpanel/vue/dist";
```

`tailwind-base.css` puts the page defaults in Tailwind's `base` layer itself; importing `base.css`
with `layer(base)` would nest them in a layer of their own, where preflight beats them. The
`@source` line is needed with `@frontpanel/vue`, because Tailwind doesn't scan `node_modules` and
would skip the classes the components use; give the path from your CSS file.

Each package's README covers the rest: the entries, fonts and preloading, motion, accessibility
and browser support ([css](packages/css/README.md), [vue](packages/vue/README.md)).

## Development

```bash
pnpm install                              # Node >= 22, pnpm 10
pnpm lint / pnpm typecheck / pnpm test
pnpm build                                # every package and the showcase
pnpm --filter @frontpanel/docs dev        # docs site dev server
pnpm --filter @frontpanel/showcase dev    # showcase dev server
pnpm changeset                            # record a user-facing change
```

## Licence

MIT. The bundled Michroma and VT323 fonts are under the SIL Open Font License; their licence texts
ship beside them.
