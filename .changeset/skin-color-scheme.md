---
'@frontpanel/css': minor
---

Each skin sets `--fp-scheme` (`light` or `dark`), and the device surfaces (`fp-device-backdrop`, `fp-device-rim`, `fp-device-body`, `fp-module`, `fp-well`, `fp-scroll-thin`, and the page extra's `fp-sheet-panel` and `fp-field`) wear it as their `color-scheme`, so native scrollbars and controls inside a device match its skin, including a skin forced on a nested element. `base.css` sets the root from the same variable. A custom dark skin should set `--fp-scheme: dark`.
