import { defineConfig } from 'vitepress'
import { sections } from './llms/build'
import { llmsPlugin, writeLlmsFiles } from './llms/plugin'
import { base, description, sidebar, siteUrl } from './site'

// The pages served as Markdown too (see llms/), by their path in the docs.
const markdownPages = new Set(sections.flatMap(section => section.pages.map(page => page.path)))

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
    // The link preview, from og.md, which the record script screenshots.
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Frontpanel' }],
    ['meta', { property: 'og:image', content: `${siteUrl}og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Frontpanel: a desk media player built with the kit, in its Silver and Gunmetal skins.' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  markdown: {
    config(md) {
      // The Copy page control, in a row with each doc page's title.
      md.core.ruler.push('copy-page', (state) => {
        if (state.env.relativePath === 'index.md')
          return
        const open = state.tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1')
        const close = state.tokens.findIndex(token => token.type === 'heading_close' && token.tag === 'h1')
        if (open === -1 || close === -1)
          return
        const html = (content: string) => Object.assign(new state.Token('html_block', '', 0), { content })
        state.tokens.splice(close + 1, 0, html('<CopyPage />\n</div>\n'))
        state.tokens.splice(open, 0, html('<div class="doc-title">\n'))
      })
    },
  },
  vite: {
    plugins: [llmsPlugin()],
  },
  buildEnd: writeLlmsFiles,
  // Each page's own title, description and address for its link preview.
  transformHead({ pageData, title, description: pageDescription }) {
    const path = pageData.relativePath.replace(/(?:^|\/)index\.md$/, '').replace(/\.md$/, '')
    return [
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: `${siteUrl}${path}` }],
    ]
  },
  // Each doc page names its Markdown in its head, so an agent that fetches the page finds it.
  transformPageData(pageData) {
    if (!markdownPages.has(pageData.relativePath))
      return
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'alternate', type: 'text/markdown', href: `${base}${pageData.relativePath}` }])
  },
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
      copyright: 'Copyright © 2026 <a href="https://dulan.me">Dulan K.</a>',
    },
  },
})
