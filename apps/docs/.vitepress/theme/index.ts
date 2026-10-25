import type { Theme } from 'vitepress'
import { ConfigProvider } from 'reka-ui'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h, watch } from 'vue'
import CopyPage from './CopyPage.vue'
import DeckDemo from './demos/DeckDemo.vue'
import HomeDevices from './demos/HomeDevices.vue'
import '@frontpanel/css/index.css'
import '@frontpanel/css/fonts.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  // The live device sits beside the hero text on the home page, in the hero's image slot, with
  // vp-raw keeping VitePress's unlayered element resets off the kit's layered classes. The row of
  // small devices follows the feature cards.
  // scroll-body off: a menu that locks scrolling adds no padding for the scrollbar, since the page
  // keeps the scrollbar's gutter (custom.css) and padding on top would push the content left.
  Layout: () => h(ConfigProvider, { scrollBody: false }, () => h(DefaultTheme.Layout, null, {
    'home-hero-image': () => h('div', { class: 'vp-raw' }, h(DeckDemo, { hero: true })),
    'home-features-after': () => h(HomeDevices),
  })),
  enhanceApp({ app }) {
    // Placed under each doc page's title by the copy-page rule in the config's markdown setup.
    app.component('CopyPage', CopyPage)
  },
  setup() {
    // The head script sets the skin before the first paint; this keeps it with the appearance toggle.
    const { isDark } = useData()
    watch(isDark, (dark) => {
      if (typeof document !== 'undefined')
        document.documentElement.dataset.fpSkin = dark ? 'gunmetal' : 'silver'
    }, { immediate: true })
  },
} satisfies Theme
