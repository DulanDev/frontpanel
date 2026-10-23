---
"@frontpanel/css": minor
"@frontpanel/vue": minor
---

A faceplate menu and joined buttons. In the CSS, `fp-menu` is a small brushed-chrome plate that drops in on `data-state="open"`, holding `fp-menu-item` rows, which press into the plate when `data-highlighted`, and `fp-menu-separator` grooves; `fp-button-group` joins `fp-chrome-btn` buttons side by side into one bezel. In Vue, `FpMenu` puts Reka's DropdownMenu behind a `trigger` slot, with `side`, `align`, `modal`, `to` and `v-model:open`, and carries the skin around its trigger to the plate; `FpMenuItem` emits `select` and takes `as`, `disabled` and `textValue`; `FpMenuSeparator` divides the rows. `FpButtonGroup` is a named `role="group"` around joined buttons, so a menu's button can sit beside the action it offers more of.
