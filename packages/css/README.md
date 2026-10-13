# @frontpanel/css

An early-2000s hardware skin in plain CSS, for building device front panels in the browser:
liquid-chrome bezels, gel buttons, molded caps, LCD glass and LEDs. Two skins, Chrome Silver and
Gunmetal Night, follow the system setting. Tokens are `--fp-*` and classes `.fp-*`, with an
optional Tailwind 4 entry.

The UI kit behind [WhatsTheNextChord](https://whatsthenextchord.com).

> `0.x`: the class and token names may still change between minor versions. Pin the version.

## Install

```bash
npm install @frontpanel/css
```

## Use it

Plain CSS, everything in `@layer frontpanel`, so your own unlayered styles win:

```css
@import "@frontpanel/css/index.css";  /* tokens and .fp-* classes */
@import "@frontpanel/css/fonts.css";  /* optional: the bundled display and LCD fonts */
@import "@frontpanel/css/page.css";   /* optional: website pieces around a device */
@import "@frontpanel/css/base.css";   /* optional: page defaults */
```

Tailwind 4, where the tokens join the theme (`bg-fp-shell`, `text-fp-ink`, `font-fp-lcd`) and the
classes become utilities, so variants such as `lg:fp-module` work:

```css
@import "tailwindcss";
@import "@frontpanel/css/tailwind.css";
@import "@frontpanel/css/fonts.css";          /* optional */
@import "@frontpanel/css/tailwind-page.css";  /* optional */
@import "@frontpanel/css/tailwind-base.css";  /* optional, and with no layer() */
```

`tailwind-base.css` puts the page defaults in Tailwind's `base` layer itself. Importing `base.css`
with `layer(base)` would nest them in a layer of their own, where preflight beats them.

From TypeScript, import the file (`import '@frontpanel/css/index.css'`) rather than the bare
package name, which a type checker reads as a module without types.

## Entries

| File | Holds | Global side effects |
| --- | --- | --- |
| `index.css` | `tokens.css` and `components.css` | None |
| `tokens.css` | The `--fp-*` colour and font tokens for both skins | None |
| `components.css` | The `.fp-*` classes | None |
| `fonts.css` | `@font-face` for Michroma and VT323 (latin, woff2) | None until used |
| `page.css` | Website pieces: `fp-field`, the phone bottom sheet (`fp-sheet-panel`, `fp-sheet-*`) | None |
| `base.css` | Page defaults: skin colours and UI font on the root, focus ring, selection | Yes, opt-in |
| `tailwind.css`, `tailwind-page.css`, `tailwind-base.css` | The same, for Tailwind 4 | As above |

## Skins

Chrome Silver is the default and Gunmetal Night follows a dark system setting. Force either on
any element, including the root, with `data-fp-skin="silver"` or `data-fp-skin="gunmetal"`. Every
text pairing passes WCAG AA in both.

## Layout and input

A device can scale as a whole or reflow its modules at your breakpoints: the classes carry no
viewport breakpoints. Controls are 44 px by default and 36 px under a precise pointer
(`pointer: fine`). Each interactive class has its own focus ring and handles reduced motion.

## Licence

MIT. The bundled Michroma and VT323 fonts are under the SIL Open Font License; their licence texts
ship in `fonts/`.
