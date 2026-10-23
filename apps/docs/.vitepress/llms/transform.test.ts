import type { PageData } from './transform'
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { buildLlmsFiles, loadPageData } from './build'
import { pageMarkdown } from './transform'

const data: PageData = {
  version: '9.9.9',
  components: {
    FpLamp: {
      props: [
        { name: 'lit', type: 'boolean', default: 'false', required: false, description: 'Lights it.' },
        { name: 'side', type: '"left" | "right"', required: true, description: 'Which side,\nleft or right.' },
        { name: 'as', type: 'string', required: false, description: '' },
        { name: 'asChild', type: 'boolean', required: false, description: '' },
      ],
      events: [{ name: 'toggle', description: 'It flipped.' }],
      slots: [{ name: 'default', description: '' }],
    },
  },
  classes: [
    { name: 'fp-lamp', entry: 'core', doc: 'A lamp.', states: ['.fp-lamp:hover'] },
    { name: 'fp-sign', entry: 'page', doc: 'A sign.', states: [] },
  ],
  skins: [
    { name: 'Silver', colours: { ink: '#000000', shell: '#ffffff', edge: 'rgb(0 0 0 / 0.4)' } },
    { name: 'Gunmetal', colours: { ink: '#777777', shell: '#666666', edge: 'rgb(0 0 0 / 0.6)' } },
  ],
  pairs: [
    { fg: 'ink', bg: 'shell', kind: 'text', where: 'text on the body' },
    { fg: 'edge', bg: 'shell', kind: 'ui', where: 'an edge' },
  ],
}

const page = (body: string, path = 'guide/lamps.md') => pageMarkdown(`# Lamps\n\n${body}\n`, path, data)
const body = (body: string, path?: string) => page(body, path).split('\n').slice(4).join('\n').trim()

describe('pageMarkdown', () => {
  it('puts the version and the page address under the title', () => {
    expect(page('Text.')).toBe('# Lamps\n\n> Frontpanel 9.9.9 docs · https://dulandev.github.io/frontpanel/guide/lamps\n\nText.\n')
  })

  it('drops front matter, scripts and styles', () => {
    const source = '---\ntitle: Lamps\n---\n<script setup lang="ts">\nconst a = 1\n</script>\n\n# Lamps\n\nText.\n\n<style>\n.a {}\n</style>\n'
    expect(pageMarkdown(source, 'guide/lamps.md', data)).toBe('# Lamps\n\n> Frontpanel 9.9.9 docs · https://dulandev.github.io/frontpanel/guide/lamps\n\nText.\n')
  })

  it('turns a demo into a vue sample without the site\'s classes', () => {
    expect(body('<div class="vp-raw demo demo-row">\n  <FpLamp class="demo-lamp" lit />\n  <FpWell class="fp-well demo-well">\n    <b>On</b>\n  </FpWell>\n</div>')).toBe(
      '```vue\n<FpLamp lit />\n<FpWell class="fp-well">\n  <b>On</b>\n</FpWell>\n```',
    )
  })

  it('drops a demo when a hand-written sample follows it', () => {
    expect(body('<div class="vp-raw demo">\n  <FpLamp lit />\n</div>\n\n```vue\n<FpLamp />\n```')).toBe('```vue\n<FpLamp />\n```')
  })

  it('points to the site for a demo that is one of its own components', () => {
    expect(body('<div class="vp-raw demo">\n  <DeckDemo hero />\n</div>')).toBe('*A live demo runs here on the site: https://dulandev.github.io/frontpanel/guide/lamps*')
  })

  it('keeps other HTML as it is', () => {
    expect(body('<div class="note">\n  <b>Hi</b>\n</div>')).toBe('<div class="note">\n  <b>Hi</b>\n</div>')
  })

  it('leaves code fences alone, whatever they hold', () => {
    const fenced = '````md\n<script setup>\n</script>\n<div class="vp-raw demo">\n</div>\n<ApiTable name="FpLamp" />\n::: tip\n[a](./b)\n```\n````'
    expect(body(fenced)).toBe(fenced)
  })

  it('writes an API table as Markdown tables', () => {
    expect(body('<ApiTable name="FpLamp" />')).toBe([
      '**`FpLamp`** · takes Reka\'s `as` and `asChild`',
      '',
      '| Prop | Type | Default | Description |',
      '| --- | --- | --- | --- |',
      '| `lit` | `boolean` | `false` | Lights it. |',
      '| `side` (required) | `"left" \\| "right"` |  | Which side, left or right. |',
      '',
      '| Event or slot | Description |',
      '| --- | --- |',
      '| `@toggle` | It flipped. |',
      '| `#default` | The content. |',
    ].join('\n'))
  })

  it('writes the colour tokens of each skin', () => {
    expect(body('<div class="vp-raw">\n  <TokenTable show="swatches" />\n</div>')).toBe([
      '| Token | Silver | Gunmetal |',
      '| --- | --- | --- |',
      '| `--fp-color-ink` | `#000000` | `#777777` |',
      '| `--fp-color-shell` | `#ffffff` | `#666666` |',
      '| `--fp-color-edge` | `rgb(0 0 0 / 0.4)` | `rgb(0 0 0 / 0.6)` |',
    ].join('\n'))
  })

  it('writes the checked pairs with their contrast, and marks a failure', () => {
    expect(body('<div class="vp-raw">\n  <TokenTable show="pairs" />\n</div>')).toBe([
      '| Pair | Where | Needs | Silver | Gunmetal |',
      '| --- | --- | --- | --- | --- |',
      '| `ink` on `shell` | text on the body | 4.5:1 | 21.00:1 | 1.28:1 fails |',
      '| `edge` on `shell` | an edge | 3:1 |  |  |',
    ].join('\n'))
  })

  it('lists the classes of one entry', () => {
    expect(body('<div class="class-list">\n  <section v-for="item in core" :key="item.name">\n  </section>\n</div>')).toBe(
      '### .fp-lamp\n\nA lamp.\n\nResponds to: `.fp-lamp:hover`',
    )
    expect(body('<div class="class-list">\n  <section v-for="item in page" :key="item.name">\n  </section>\n</div>')).toBe('### .fp-sign\n\nA sign.')
  })

  it('turns a container into a titled quote', () => {
    expect(body('::: warning 0.x\nPin it.\n\nSee [Skins](./skins).\n:::')).toBe(
      '> **0.x**\n>\n> Pin it.\n>\n> See [Skins](https://dulandev.github.io/frontpanel/guide/skins.md).',
    )
    expect(body('::: tip\nNote.\n:::')).toBe('> **Tip**\n>\n> Note.')
  })

  it('points links to other pages at their Markdown, and leaves the rest', () => {
    expect(body('[a](../reference/tokens#pairs) [b](/guide/fonts) [c](https://reka-ui.com) [d](#top) [e](/fonts/a.woff2)', 'reference/classes.md')).toBe(
      '[a](https://dulandev.github.io/frontpanel/reference/tokens.md#pairs) [b](https://dulandev.github.io/frontpanel/guide/fonts.md) [c](https://reka-ui.com) [d](#top) [e](/fonts/a.woff2)',
    )
  })
})

describe('the docs as Markdown', async () => {
  // The real pages and data, with the version held still so a release doesn't change the output.
  const files = await buildLlmsFiles({ ...await loadPageData(), version: '0.0.0' })

  // The page with the most to convert, kept whole: a change to it shows up in review.
  it('matches the components page as it was reviewed', async () => {
    await expect(files.get('reference/components.md')).toMatchFileSnapshot('./__golden__/components.md')
  })

  it('leaves nothing that only works on the site outside code', () => {
    for (const [name, markdown] of files) {
      let inCode = false
      const prose = markdown.split('\n').filter((line) => {
        if (/^(?:`{3}|~{3})/.test(line))
          inCode = !inCode
        return !inCode
      }).join('\n')
      expect(prose, name).not.toMatch(/<script|<style|<ApiTable|<TokenTable|vp-raw|class="demo|v-for=|^:::/m)
    }
  })

  it('lists every page in llms.txt, as Markdown on the site', async () => {
    const index = files.get('llms.txt')!
    const pages = [...files.keys()].filter(name => name.endsWith('.md'))
    expect(pages).toHaveLength(11)
    for (const name of pages) {
      expect(index).toContain(`(https://dulandev.github.io/frontpanel/${name}): `)
      expect(await readFile(new URL(`../../${name}`, import.meta.url), 'utf8')).toBeTruthy()
    }
  })

  it('summarises a page by its description, else by its first sentence', () => {
    const index = files.get('llms.txt')!
    expect(index).toContain('guide/layout.md): A device can scale as a whole or reflow its modules')
    expect(index).toContain('guide/skins.md): Frontpanel ships two skins with the same token names:')
  })

  it('joins every page in llms-full.txt', () => {
    const full = files.get('llms-full.txt')!
    for (const [name, markdown] of files) {
      if (name.endsWith('.md'))
        expect(full).toContain(markdown)
    }
  })
})
