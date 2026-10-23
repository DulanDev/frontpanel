---
description: The three faces of the look, the two that are bundled, and how to self-host and preload them.
---

# Fonts

Three faces make the look:

| Token | Face | Used for |
| --- | --- | --- |
| `--fp-font-ui` | Tahoma, from the system | Text and button labels |
| `--fp-font-display` | Michroma, bundled | Silkscreen labels and titles |
| `--fp-font-lcd` | VT323, bundled | LCD readouts |

## The bundled fonts

`fonts.css` loads Michroma and VT323 from its own `fonts/` folder (latin, woff2), and your bundler
serves them from wherever it puts them:

```css
@import "@frontpanel/css/fonts.css";
```

Without it, the tokens fall back to Arial Black and Courier New. Both fonts are under the SIL
Open Font License; the licence texts ship beside them.

## Self-hosting and preloading

To preload the fonts, they need URLs that don't change between builds, which a bundler's hashed
file names don't give. Copy `fonts/` into your public folder at build time, and write the two
`@font-face` rules yourself in place of `fonts.css`:

```css
@font-face {
  font-family: "Michroma";
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/michroma-latin-400.woff2") format("woff2");
}

@font-face {
  font-family: "VT323";
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/vt323-latin-400.woff2") format("woff2");
}
```

```html
<link rel="preload" href="/fonts/michroma-latin-400.woff2" as="font" type="font/woff2" crossorigin>
```

The file names (`michroma-latin-400.woff2`, `vt323-latin-400.woff2`) stay the same across
releases; renaming one would be a breaking change.
