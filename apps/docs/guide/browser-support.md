# Browser support

| Entry | Needs |
| --- | --- |
| Plain CSS (`index.css`, `components.css` and the rest) | Chrome and Edge 112, Firefox 117, Safari 16.5 or later (Baseline 2023) |
| Tailwind (`tailwind.css` and the rest) | Whatever Tailwind 4 supports, since it compiles the CSS |
| Vue components | Vue 3.5 or later, in the same browsers |

The plain CSS uses native CSS nesting, which sets the floor. Everything else it uses is older:
cascade layers, `:where()`, `color-mix()`, `dvh` and the `translate` property. Tailwind compiles
the nesting away, so its users get Tailwind's own range instead.

A thin scrollbar (`fp-scroll-thin`) uses `scrollbar-width` and `scrollbar-color`, which some
browsers ignore; they show their own scrollbar instead, and nothing breaks.
