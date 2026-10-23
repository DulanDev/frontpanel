import { defineConfig } from 'vitepress'
import { llmsPlugin, writeLlmsFiles } from './llms/plugin'
import { base, description, sidebar } from './site'

// VitePress keeps its light/dark choice in this key; the skin follows the same choice, set before
// the first paint so a demo never flashes the other skin.
const skinScript = `;(() => {
  const choice = localStorage.getItem('vitepress-theme-appearance') || 'auto'
  const dark = choice === 'auto' ? matchMedia('(prefers-color-scheme: dark)').matches : choice === 'dark'
  document.documentElement.dataset.fpSkin = dark ? 'gunmetal' : 'silver'
})()`

export default defineConfig({
  base,
  title: 'Frontpanel',
  description,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['script', {}, skinScript],
  ],
  markdown: {
    config(md) {
      // The Copy page control, under each doc page's title.
      md.core.ruler.push('copy-page', (state) => {
        if (state.env.relativePath === 'index.md')
          return
        const title = state.tokens.findIndex(token => token.type === 'heading_close' && token.tag === 'h1')
        if (title === -1)
          return
        const control = new state.Token('html_block', '', 0)
        control.content = '<CopyPage />\n'
        state.tokens.splice(title + 1, 0, control)
      })
    },
  },
  vite: {
    plugins: [llmsPlugin()],
  },
  buildEnd: writeLlmsFiles,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/components' },
    ],
    sidebar,
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/DulanDev/frontpanel' }],
    footer: {
      message: 'MIT licensed. The UI kit behind <a href="https://whatsthenextchord.com">WhatsTheNextChord</a>.',
    },
  },
})
