import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { watch } from 'vue'
import '@frontpanel/css/index.css'
import '@frontpanel/css/fonts.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  setup() {
    // The head script sets the skin before the first paint; this keeps it with the appearance toggle.
    const { isDark } = useData()
    watch(isDark, (dark) => {
      if (typeof document !== 'undefined')
        document.documentElement.dataset.fpSkin = dark ? 'gunmetal' : 'silver'
    }, { immediate: true })
  },
} satisfies Theme
