---
'@frontpanel/css': minor
---

Add the Chrome Silver and Gunmetal Night tokens (`--fp-*`) and the `.fp-*` classes for building device front panels: device frame, chrome, push and gel buttons, caps, modules, wells, LCD, LEDs and screws. Each interactive class carries its own focus ring and reduced-motion handling, so nothing depends on a global stylesheet. `components.css` holds them in `@layer frontpanel`; `tailwind.css` declares the same classes as `@utility fp-*` and maps the tokens into the theme, so variants like `lg:fp-module` and colours like `bg-fp-shell` work. Website pieces around a device, the text field and the phone bottom sheet, ship separately in the opt-in `page.css` and `tailwind-page.css`.
