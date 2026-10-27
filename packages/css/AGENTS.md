# @frontpanel/css

## Light and skins

One light source, top-left: bevels are light on top and left, and invert when pressed.

List each new colour pairing in `src/contrast-pairs.ts`; the contrast test holds it to WCAG AA in
both skins.

## Layout and sizing

Layout is the developer's choice: a device may scale as a whole or reflow its modules at their own
breakpoints, and Frontpanel must allow both. Control sizes follow the input (44 px by default, 36 px
under `pointer: fine`), and modules size to their container.

Website-only pieces (the text field, the phone bottom sheet, page defaults) go in the opt-in page
extra (`src/page`), outside the core entries.

## Motion

Handle reduced motion inside each component.
