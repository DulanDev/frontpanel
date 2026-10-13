---
'@frontpanel/vue': patch
---

`FpLed` and `FpCap` write their colour classes out in full, so Tailwind generates them. They were built from a template (`fp-led-${color}`), which Tailwind's scanner cannot see, so in a Tailwind app a lit amber or red LED showed green and a coloured cap kept the default plastic.
