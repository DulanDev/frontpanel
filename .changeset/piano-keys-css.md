---
'@frontpanel/css': minor
---

Latching piano keys, after the key row on an old cassette deck. `fp-keys` is a row in a dark well whose children alternate between an `fp-silk` label and its `fp-key`; with `data-orientation="vertical"` the keys lie on their side, stacked. `fp-key` goes on a button with `role="radio"` or `role="checkbox"` and `aria-checked`: checked, it latches part way down, and a press sinks it deeper. The keys are silver in a slate well in Chrome Silver, and dark in a black well in Gunmetal Night. The strip at a key's foot is an LED in its `fp-led-*` colour, lit while latched, or cream plastic with `data-strip="plain"`, set in a rim of the well's colour. New tokens: `--fp-color-key-hi`, `-key`, `-key-lo`, `-key-well`, `-key-knurl-hi`, `-key-knurl-lo`, `-key-strip` and `-key-ring`, the focus ring round a key in its well.
