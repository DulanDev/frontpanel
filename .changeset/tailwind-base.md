---
'@frontpanel/css': patch
---

Add `tailwind-base.css`, the page defaults for Tailwind users. Import it after `tailwindcss` with no `layer()`: it puts the rules straight in Tailwind's `base` layer, after preflight. Importing `base.css` with `layer(base)` nested them in a layer of their own, which lost to preflight, so pages fell back to the system font. `base.css` is unchanged for plain CSS, and both are now generated from one source.
