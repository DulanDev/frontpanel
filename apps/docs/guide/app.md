# Using it in an app

[WhatsTheNextChord](https://whatsthenextchord.com), a chord-progression app, runs on Frontpanel:
Nuxt, Vue 3 and Tailwind 4, with its device skinned by this kit. This page walks through how it
is put together, as one worked example of a real app around a device.

The app is a **website around its device**: it has pages, a header and footer, text fields and a
phone layout. So it takes the page extra on top of the core, and its device **reflows** at the
app's own breakpoints rather than scaling as one picture.

## The stylesheet

One CSS file brings in the Tailwind entries, the page extra and the page defaults, and points
Tailwind at the components:

```css
@import "tailwindcss";
@import "@frontpanel/css/tailwind.css";
@import "@frontpanel/css/tailwind-page.css";  /* text fields, the phone sheet */
@import "@frontpanel/css/tailwind-base.css";  /* the page wears the skin */

@source "../node_modules/@frontpanel/vue/dist";
```

The tokens become Tailwind colours and fonts, so the app's own markup uses them with utilities
(`text-fp-ink-soft`, `bg-fp-lcd-bg`, `border-fp-edge`, `font-fp-display`) and follows the skin
without any classes of its own.

The app serves the two bundled fonts from fixed URLs and preloads them, because its main page
renders on the client and a late font swap shifted the layout. [Fonts](./fonts#self-hosting-and-preloading)
has the recipe: copy `fonts/` into the public folder at build time and write the two
`@font-face` rules yourself instead of importing `fonts.css`.

## The device shell

The app reflows, so it builds the shell from classes rather than `FpDevice`, whose job is
scaling (`fit`). The rim appears from the `sm` breakpoint up; on a phone the body runs edge to
edge, with no chrome ring taking up the narrow screen:

```html
<div class="fp-device-backdrop min-h-dvh sm:p-4 lg:p-6">
  <div class="mx-auto max-w-[1200px] sm:fp-device-rim">
    <div class="fp-device-body grid gap-3 p-3 lg:grid-cols-[1fr_20rem]">
      <!-- modules -->
    </div>
  </div>
</div>
```

The breakpoints and the grid are the app's; Frontpanel's classes carry none. See
[Layout and input](./layout) for the two ways a device can lay out.

## Panels: a sheet on phones, docked on wide screens

Panels such as "Add chord" or "Saved" are windows. On a wide screen a panel docks in the side
column as a module; on a phone it lifts over the device as a bottom sheet. One `FpWindow` does
both: `sheet` switches its skin, and the app decides when, with its own media query.
`PanelWindow.vue`:

```vue
<script setup lang="ts">
import { FpWindow } from '@frontpanel/vue'
import { useMediaQuery } from '@vueuse/core'

defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()

const docked = useMediaQuery('(min-width: 1024px)')
</script>

<template>
  <FpWindow
    :title="title"
    :sheet="!docked"
    closable
    class="fp-scroll-thin fixed inset-x-0 bottom-0 max-h-[70dvh] overflow-y-auto lg:static lg:max-h-none"
    @close="emit('close')"
  >
    <slot />
  </FpWindow>
</template>
```

Where it opens, it slides in with the page extra's transition:

```vue
<Transition name="fp-sheet">
  <PanelWindow v-if="open" title="Saved" @close="open = false">
    ...
  </PanelWindow>
</Transition>
```

Positioning stays the caller's, because a sheet's place depends on the page around it (the app's
sits above its phone button bar, not at the very bottom). Closing a window removes its focused close button, so
send focus back to the button that opened the panel.

A window that is a side panel rather than part of the main flow can render as an `aside`, and
one whose contents run edge to edge, like a list of rows, can drop the body's padding:

```vue
<FpWindow title="Inspector" as="aside" flush>
  ...
</FpWindow>
```

## Classes and components together

Most of the app's device is classes, and the components appear where they save code:

| Piece | How the app builds it |
| --- | --- |
| Icons | `FpIcon`, the 16 px pixel set, typed by `FpIconName` |
| Status lights | `FpLed`, with its colour from app state (`FpLedColor`) |
| Panels | `FpWindow`, as above |
| Transport and tool buttons | `fp-chrome-btn` on its own buttons, with `aria-pressed` for toggles |
| Chords on the track | `fp-cap`, coloured by chord family (minor chords blue, dominant sevenths amber, and so on), with `aria-pressed` on the selected one |
| Main readout | `fp-lcd` with the app's own layout inside, and `fp-lcd-redraw` on the line that changes |
| Primary actions | `fp-gel` |
| Name fields | `fp-field`, from the page extra |

Mixing is fine: a component renders the same classes you would write by hand, and the classes
style ARIA state (`aria-pressed`, `aria-expanded`, `aria-current`) rather than state classes of
their own, so either way the look follows the markup.

## The skin

The app sets no `data-fp-skin`: it wears Chrome Silver in a light system and Gunmetal Night in a
dark one, and `tailwind-base.css` gives the page and its native controls the same scheme. To add a
switch, set the attribute on the root before the first paint, so the page never flashes the
other skin:

```html
<script>
  const choice = localStorage.getItem('skin') // 'silver', 'gunmetal' or null to follow the system
  if (choice) document.documentElement.dataset.fpSkin = choice
</script>
```

## Checklist

- One stylesheet: the Tailwind entry, plus the page extra and page defaults for a website.
- An `@source` line for `@frontpanel/vue`'s `dist`, or the components' classes are never generated.
- Fonts from fixed URLs and preloaded, if the first render waits on JavaScript.
- Breakpoints in the app, never expected from the kit: reflow with classes, or scale with
  `FpDevice fit`.
- Focus sent back when a window closes, and a name on every icon-only button
  ([Accessibility](./accessibility)).
