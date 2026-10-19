import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h, watch } from 'vue'
import DeckDemo from './demos/DeckDemo.vue'
import '@frontpanel/css/index.css'
import '@frontpanel/css/fonts.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  // The live device sits beside the hero text on the home page, in the hero's image slot, with
  // vp-raw keeping VitePress's unlayered element resets off the kit's layered classes.
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-hero-image': () => h('div', { class: 'vp-raw' }, h(DeckDemo, { hero: true })),
  }),
  setup() {
    // The head script sets the skin before the first paint; this keeps it with the appearance toggle.
    const { isDark } = useData()
    watch(isDark, (dark) => {
      if (typeof document !== 'undefined')
        document.documentElement.dataset.fpSkin = dark ? 'gunmetal' : 'silver'
    }, { immediate: true })
  },
} satisfies Theme
