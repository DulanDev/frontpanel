# Getting started

Frontpanel comes in two packages. `@frontpanel/css` is the skin: tokens, `.fp-*` classes, fonts
and a Tailwind 4 entry, usable from any framework or none. `@frontpanel/vue` adds Vue 3
components on top of it.

::: warning 0.x
Class names, tokens and props may still change between minor versions until 1.0. Pin the version.
:::

## Plain CSS

```bash
npm install @frontpanel/css
```

Everything sits in `@layer frontpanel`, so your own unlayered styles win over it.

```css
@import "@frontpanel/css/index.css";  /* tokens and .fp-* classes */
@import "@frontpanel/css/fonts.css";  /* optional: the display and LCD fonts */
@import "@frontpanel/css/page.css";   /* optional: website pieces around a device */
@import "@frontpanel/css/base.css";   /* optional: page defaults */
```

Then build with the classes:

```html
<div class="fp-device-backdrop">
  <div class="fp-device-rim">
    <div class="fp-device-body">
      <section class="fp-module">
        <div class="fp-module-title"><h2 class="fp-silk">Deck</h2></div>
        <button class="fp-chrome-btn" aria-pressed="false">Play</button>
        <button class="fp-gel">Save</button>
      </section>
    </div>
  </div>
</div>
```

From TypeScript, import the file (`import '@frontpanel/css/index.css'`) rather than the bare
package name, which a type checker reads as a module without types.

## Tailwind 4

The tokens join the theme (`bg-fp-shell`, `text-fp-ink`, `font-fp-lcd`) and the classes become
utilities, so variants like `lg:fp-module` work.

```css
@import "tailwindcss";
@import "@frontpanel/css/tailwind.css";
@import "@frontpanel/css/fonts.css";          /* optional */
@import "@frontpanel/css/tailwind-page.css";  /* optional */
@import "@frontpanel/css/tailwind-base.css";  /* optional, and with no layer() */
```

`tailwind-base.css` puts the page defaults in Tailwind's `base` layer itself. Importing
`base.css` with `layer(base)` would nest them in a layer of their own, where Tailwind's preflight
beats them.

## Vue

```bash
npm install @frontpanel/vue
```

It needs Vue 3.5 or later, and brings `@frontpanel/css` with it. The components ship no CSS of
their own, so import the stylesheet once, plain or Tailwind as above.

With Tailwind, add an `@source` line for the components. Tailwind doesn't scan `node_modules`,
so without it the classes the components use are never generated. Give the path from your CSS
file:

```css
@source "../node_modules/@frontpanel/vue/dist";
```

```vue
<script setup lang="ts">
import { FpButton, FpDevice, FpGelButton, FpLcd, FpLcdLine, FpLed, FpWindow } from '@frontpanel/vue'
import { ref } from 'vue'

const playing = ref(false)
</script>

<template>
  <FpDevice fit="width" :width="600">
    <FpWindow title="Deck">
      <FpLcd>
        <FpLcdLine :text="playing ? 'PLAYING' : 'STOPPED'" ghost :cells="12" redraw />
      </FpLcd>
      <FpLed :lit="playing" color="amber" />
      <FpButton :pressed="playing" @click="playing = !playing">
        Play
      </FpButton>
      <FpGelButton>Save</FpGelButton>
    </FpWindow>
  </FpDevice>
</template>
```

## Entries

| File | Holds | Global side effects |
| --- | --- | --- |
| `index.css` | `tokens.css` and `components.css` | None |
| `tokens.css` | The `--fp-*` colour and font tokens for both skins | None |
| `components.css` | The `.fp-*` classes | None |
| `fonts.css` | `@font-face` for Michroma and VT323 | None until used |
| `page.css` | Website pieces: `fp-field` and the phone bottom sheet | None |
| `base.css` | Page defaults: skin colours and UI font on the root, focus ring, selection | Yes, opt-in |
| `tailwind.css`, `tailwind-page.css`, `tailwind-base.css` | The same, for Tailwind 4 | As above |
