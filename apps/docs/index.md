---
layout: home

hero:
  name: Frontpanel
  text: Early-2000s hardware, in the browser
  tagline: Liquid-chrome bezels, gel buttons, LCD readouts and LEDs for building device front panels, in plain CSS with Vue 3 components on top.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Components
      link: /reference/components

features:
  - title: Plain CSS first
    details: Tokens and .fp-* classes in a cascade layer, so your own styles win. A Tailwind 4 entry turns them into utilities with variants.
  - title: Two skins
    details: Chrome Silver and Gunmetal Night follow the system setting, or force either on any element. Every text pairing passes WCAG AA in both.
  - title: Vue components on Reka UI
    details: Device, window, buttons, caps, LCD, LEDs and a pixel icon set, with behaviour and ARIA from Reka UI.
---

<script setup lang="ts">
import DeckDemo from './.vitepress/theme/demos/DeckDemo.vue'
</script>

<div class="home-demo vp-raw">
  <DeckDemo />
</div>

