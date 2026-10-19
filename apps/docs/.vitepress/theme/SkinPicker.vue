<script setup lang="ts">
import { FpButton, FpIcon, FpLcd, FpLcdLine } from '@frontpanel/vue'
import { useData } from 'vitepress'
import { computed, onMounted, shallowRef } from 'vue'

// The skin picker: the skin's name on an LCD, stepped through like a 2000s player's skin browser.
// It is another face of the appearance toggle: stepping sets VitePress's isDark, which the theme
// turns into data-fp-skin, so the nav switch and the picker always agree.

const skins = ['silver', 'gunmetal'] as const
type Skin = (typeof skins)[number]

/** The name on the LCD, and the skin's full name for assistive tech. */
const names: Record<Skin, { lcd: string, full: string }> = {
  silver: { lcd: 'SILVER', full: 'Chrome Silver' },
  gunmetal: { lcd: 'GUNMETAL', full: 'Gunmetal Night' },
}

const { isDark } = useData()

// The prerendered page names Silver: the build knows neither the reader's choice nor their system
// setting. The picker says the same until it has mounted, so hydration finds no mismatch, then
// names the skin the page already wears (the head script set it before the first paint).
const mounted = shallowRef(false)
onMounted(() => {
  mounted.value = true
})

const skin = computed<Skin>(() => mounted.value && isDark.value ? 'gunmetal' : 'silver')

/** Announce a skin only once it is stepped to, not when the page loads in one. */
const stepped = shallowRef(false)

function pick(by: 1 | -1): void {
  const next = skins[(skins.indexOf(skin.value) + by + skins.length) % skins.length]!
  isDark.value = next === 'gunmetal'
  stepped.value = true
}
</script>

<template>
  <div class="skin-picker" role="group" aria-label="Skin">
    <FpButton aria-label="Previous skin" @click="pick(-1)">
      <FpIcon name="left" />
    </FpButton>
    <FpLcd class="skin-lcd">
      <span class="skin-label">SKIN</span>
      <FpLcdLine :text="names[skin].lcd" ghost :cells="8" redraw class="skin-name" />
    </FpLcd>
    <FpButton aria-label="Next skin" @click="pick(1)">
      <FpIcon name="right" />
    </FpButton>
    <span class="sr-only" role="status">{{ stepped ? `Skin: ${names[skin].full}` : '' }}</span>
  </div>
</template>

<style scoped>
.skin-picker {
  display: flex;
  align-items: stretch;
  gap: 6px;
}

.skin-lcd {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 12px;
  padding-inline: 12px;
  font-family: var(--fp-font-lcd);
}

.skin-label {
  font-size: 16px;
  line-height: 1;
}

.skin-name {
  font-size: 26px;
  line-height: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
