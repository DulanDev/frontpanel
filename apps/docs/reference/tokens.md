<script setup lang="ts">
import TokenTable from '../.vitepress/theme/demos/TokenTable.vue'
</script>

# Tokens

Every colour is a `--fp-color-*` custom property, set for both skins in `tokens.css`. A custom
skin sets the same names. With Tailwind, each maps into the theme with an `fp-` prefix:
`--fp-color-shell` becomes `bg-fp-shell`, `text-fp-shell` and so on, and changes with the skin.

## Colours

Read from the stylesheet as it renders, so these are the values that ship.

<div class="vp-raw">
  <TokenTable show="swatches" />
</div>

## Fonts

| Token | Stack | Used for |
| --- | --- | --- |
| `--fp-font-ui` | Tahoma, Verdana, "Segoe UI", system-ui, sans-serif | Text and button labels |
| `--fp-font-display` | "Michroma", "Arial Black", sans-serif | Silkscreen labels and titles |
| `--fp-font-lcd` | "VT323", "Courier New", monospace | LCD readouts |

Michroma and VT323 load from `fonts.css`; see [Fonts](../guide/fonts).

## Checked pairs

The colour pairings the classes rely on, and their contrast in each skin. Text needs 4.5:1 and
other UI 3:1 for WCAG AA, and a test holds both skins to it. A custom skin that keeps these
passing keeps the classes readable. A pair not listed is not promised.

<div class="vp-raw">
  <TokenTable show="pairs" />
</div>
