---
'@frontpanel/css': minor
---

Latching piano keys, after the key row on an old cassette deck. `fp-keys` is a row in a black well whose children alternate between an `fp-silk` label and its `fp-key`; with `data-orientation="vertical"` the keys lie on their side, stacked. `fp-key` goes on a button with `role="radio"` or `role="checkbox"` and `aria-checked`: checked, it latches part way down, and a press sinks it deeper. The strip at its foot is an LED in its `fp-led-*` colour, lit while latched, or cream plastic with `data-strip="plain"`. New tokens: `--fp-color-key-hi`, `-key`, `-key-lo`, `-key-well`, `-key-strip` and `-key-ring`, the focus ring round a key on its black well.
