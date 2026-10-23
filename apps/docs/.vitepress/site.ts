import type { DefaultTheme } from 'vitepress'

// What the config, the theme and the Markdown build all need: where the site lives and its pages.

/** Served from GitHub Pages at dulandev.github.io/frontpanel/. */
export const base = '/frontpanel/'
export const siteUrl = 'https://dulandev.github.io/frontpanel/'

export const description = 'An early-2000s hardware UI kit for building device front panels: liquid-chrome bezels, gel buttons, LCD readouts and LEDs, in plain CSS with Vue 3 components on top.'

export const sidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Getting started', link: '/guide/getting-started' },
      { text: 'Using it in an app', link: '/guide/app' },
      { text: 'Skins', link: '/guide/skins' },
      { text: 'Layout and input', link: '/guide/layout' },
      { text: 'Fonts', link: '/guide/fonts' },
      { text: 'Motion', link: '/guide/motion' },
      { text: 'Accessibility', link: '/guide/accessibility' },
      { text: 'Browser support', link: '/guide/browser-support' },
      // The docs for AI agents, as Markdown (see llms/).
      { text: 'llms.txt', link: '/llms.txt' },
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
] satisfies DefaultTheme.SidebarItem[]
