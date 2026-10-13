<script setup lang="ts">
import { FpButton, FpGelButton, FpHousing, FpLcd, FpLcdLine, FpLed } from '@frontpanel/vue'
</script>

# Skins

Frontpanel ships two skins with the same token names: **Chrome Silver**, the default, and
**Gunmetal Night**, which follows a dark system setting. Every text pairing passes WCAG AA in
both, and a test holds them to it.

<div class="vp-raw demo skins">
  <div v-for="skin in ['silver', 'gunmetal']" :key="skin" :data-fp-skin="skin" class="demo-surface demo-row">
    <FpLcd class="demo-lcd"><FpLcdLine :text="skin === 'silver' ? 'SILVER' : 'GUNMETAL'" ghost :cells="8" class="demo-lcd-line" /></FpLcd>
    <FpHousing><FpLed color="amber" lit /> REC</FpHousing>
    <FpButton>Stop</FpButton>
    <FpGelButton>Save</FpGelButton>
  </div>
</div>

## Forcing a skin

Set `data-fp-skin` on any element, the root included, and everything inside wears that skin:

```html
<html data-fp-skin="gunmetal">          <!-- the whole page, whatever the system says -->
<section data-fp-skin="silver">         <!-- one light device on a dark page -->
```

Without the attribute, the root follows `prefers-color-scheme`. A nested `data-fp-skin` always
wins inside its element, so a page can show both skins side by side, as above.

## Native controls

`base.css`, the opt-in page defaults, sets `color-scheme` on the root to match, so native
scrollbars and form controls follow the skin, forced or not.

## A custom skin

A skin is a set of `--fp-color-*` values. Set the same names on your own selector and every class
follows. The [checked pairs](../reference/tokens#checked-pairs) are the pairings the classes rely
on: a custom skin that keeps them passing stays readable.
