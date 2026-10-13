import { defineConfig } from 'vitepress'

// VitePress keeps its light/dark choice in this key; the skin follows the same choice, set before
// the first paint so a demo never flashes the other skin.
const skinScript = `;(() => {
  const choice = localStorage.getItem('vitepress-theme-appearance') || 'auto'
  const dark = choice === 'auto' ? matchMedia('(prefers-color-scheme: dark)').matches : choice === 'dark'
  document.documentElement.dataset.fpSkin = dark ? 'gunmetal' : 'silver'
})()`

export default defineConfig({
  // Served from GitHub Pages at dulandev.github.io/frontpanel/.
  base: '/frontpanel/',
  title: 'Frontpanel',
  description: 'An early-2000s hardware UI kit for building device front panels: liquid-chrome bezels, gel buttons, LCD readouts and LEDs, in plain CSS with Vue 3 components on top.',
  cleanUrls: true,
  lastUpdated: true,
  head: [['script', {}, skinScript]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/components' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Skins', link: '/guide/skins' },
          { text: 'Layout and input', link: '/guide/layout' },
          { text: 'Fonts', link: '/guide/fonts' },
          { text: 'Motion', link: '/guide/motion' },
          { text: 'Accessibility', link: '/guide/accessibility' },
          { text: 'Browser support', link: '/guide/browser-support' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Components', link: '/reference/components' },
          { text: 'Classes', link: '/reference/classes' },
          { text: 'Tokens', link: '/reference/tokens' },
        ],
      },
    ],
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/DulanDev/frontpanel' }],
    footer: {
      message: 'MIT licensed. The UI kit behind <a href="https://whatsthenextchord.com">WhatsTheNextChord</a>.',
    },
  },
})
