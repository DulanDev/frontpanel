---
'@frontpanel/css': minor
---

Add the Chrome Silver and Gunmetal Night tokens (`--fp-*`) and the `.fp-*` classes: device frame, chrome, push and gel buttons, caps, panels, wells, LCD, LEDs, field and screw. `components.css` holds them in `@layer frontpanel`; `tailwind.css` declares the same classes as `@utility fp-*` and maps the tokens into the theme, so variants like `lg:fp-module` and colours like `bg-fp-shell` work.
