# @frontpanel/css

## 0.1.0

First release: an early-2000s hardware skin for device front panels.

- The Chrome Silver and Gunmetal Night tokens (`--fp-*`), following the system setting or forced
  with `data-fp-skin`. Every text pairing passes WCAG AA in both.
- The `.fp-*` classes: device backdrop, rim and body; chrome, push buttons, gel buttons and molded
  caps (`fp-cap-blue`, `-amber`, `-graphite`, `-berry`); modules and windows with chrome title
  bars; wells, housings, silkscreen labels and screws; LCD glass and lines with unlit segments;
  LEDs; a thin scrollbar; pixel icons. Each interactive class carries its own focus ring and
  reduced-motion handling. Controls are 44 px, and 36 px under a precise pointer.
- Plain CSS in `@layer frontpanel` (`index.css`, `tokens.css`, `components.css`), and a Tailwind 4
  entry (`tailwind.css`) that maps the tokens into the theme and declares the classes as
  utilities, so variants like `lg:fp-module` work.
- An opt-in page extra for websites around a device: `page.css` / `tailwind-page.css` (a text
  field and a phone bottom sheet) and the page defaults in `base.css` / `tailwind-base.css`.
- `fonts.css` with Michroma and VT323, self-hosted woff2 under the SIL Open Font License.
