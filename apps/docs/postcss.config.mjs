import { postcssIsolateStyles } from 'vitepress'

// VitePress's own element resets and prose styles sit outside any layer, so they would beat
// Frontpanel's @layer frontpanel inside a demo (its `button` reset strips the chrome off every
// button). This keeps them off anything inside `.vp-raw`.
export default {
  plugins: [
    postcssIsolateStyles({
      includeFiles: [/vitepress[\\/]dist[\\/]client[\\/]theme-default[\\/]styles[\\/](?:base|components[\\/]vp-doc)\.css/],
    }),
  ],
}
