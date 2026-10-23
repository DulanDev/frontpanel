import type { ContrastPair } from '../../../../packages/css/src/contrast-pairs.ts'
import type { ClassDoc } from '../../reference/classes.data'
import type { ComponentDoc } from '../../reference/components.data'
import { contrast, isOpaqueHex, required } from '../../../../packages/css/src/contrast.ts'
import { siteUrl } from '../site'

/*
 * A docs page as Markdown for AI agents: the page's own prose and code, with the parts that only
 * work on the site turned into Markdown. The live demos become `vue` samples of their markup, the
 * generated tables become Markdown tables from the same data, and links point at the other pages'
 * Markdown. Code fences pass through untouched, whatever Vue they hold.
 */

export interface PageData {
  version: string
  components: Record<string, ComponentDoc>
  classes: ClassDoc[]
  /** Each skin's colour tokens, named without the --fp-color- prefix. */
  skins: { name: string, colours: Record<string, string> }[]
  pairs: ContrastPair[]
}

/** A page's address on the site, from its path in the docs (`guide/skins.md`). */
export function pageUrl(path: string, as: 'page' | 'markdown'): string {
  return siteUrl + (as === 'page' ? path.replace(/\.md$/, '') : path)
}

export function pageMarkdown(source: string, path: string, data: PageData): string {
  const lines = source.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')
  const out: string[] = []
  let fence: string | undefined

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!

    if (fence) {
      out.push(line)
      if (line.trim().startsWith(fence) && line.trim().replaceAll(fence[0]!, '') === '')
        fence = undefined
      continue
    }

    const opens = /^\s*(`{3,}|~{3,})/.exec(line)
    if (opens) {
      fence = opens[1]
      out.push(line)
      continue
    }

    // Script and style blocks run the page; they say nothing about the kit.
    const block = /^<(script|style)\b/.exec(line)
    if (block) {
      i = closing(lines, i, `</${block[1]}>`)
      continue
    }

    if (/^<div\b/.test(line)) {
      const end = closing(lines, i, '</div>')
      out.push(...htmlBlock(lines.slice(i, end + 1), lines.slice(end + 1), path, data))
      i = end
      continue
    }

    const api = /^<ApiTable name="(\w+)" \/>$/.exec(line)
    if (api) {
      out.push(...apiTable(api[1]!, data.components[api[1]!]))
      continue
    }

    const container = /^:::\s*(\w+)(?: +(\S.*))?$/.exec(line)
    if (container) {
      const end = closing(lines, i, ':::')
      out.push(...callout(container[2] ?? capitalise(container[1]!), lines.slice(i + 1, end), path))
      i = end
      continue
    }

    out.push(links(line, path))
  }

  // The page's title, then where it comes from.
  const title = out.findIndex(line => line.startsWith('# '))
  out.splice(title + 1, 0, '', `> Frontpanel ${data.version} docs · ${pageUrl(path, 'page')}`)

  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

/** The line that closes a block opened at `start`, at the start of a line; the last line if none does. */
function closing(lines: string[], start: number, close: string): number {
  const end = lines.findIndex((line, index) => index > start && line.trimEnd() === close)
  return end === -1 ? lines.length - 1 : end
}

/** A top-level `<div>`: a live demo, one of the generated tables, or plain HTML kept as it is. */
function htmlBlock(block: string[], after: string[], path: string, data: PageData): string[] {
  const inner = block.slice(1, -1)
  const html = inner.join('\n')

  const tokens = /<TokenTable show="(swatches|pairs)"/.exec(html)
  if (tokens)
    return tokens[1] === 'swatches' ? swatchTable(data) : pairTable(data)

  const list = /v-for="item in (core|page)"/.exec(html)
  if (list)
    return classList(data.classes.filter(item => item.entry === list[1]))

  if (!/\bclass="[^"]*\bdemo\b/.test(block[0]!))
    return block

  // A hand-written sample right after the demo already shows how to use it.
  if (/^\s*(?:`{3,}|~{3,})/.test(after.find(line => line.trim() !== '') ?? ''))
    return []

  // A demo that is one of the site's own components has no markup worth copying.
  if (/^<(?!Fp)[A-Z]\w*\b[^>]*\/>$/.test(html.trim()))
    return [`*A live demo runs here on the site: ${pageUrl(path, 'page')}*`]

  return ['```vue', ...dedent(inner.map(withoutDemoClasses)), '```']
}

/** Drops the docs' own `demo-*` and `vp-raw` classes, which mean nothing outside the site. */
function withoutDemoClasses(line: string): string {
  return line.replace(/ class="([^"]*)"/g, (_attribute, classes: string) => {
    const kept = classes.split(/\s+/).filter(name => name && name !== 'vp-raw' && !/^demo(?:-|$)/.test(name))
    return kept.length ? ` class="${kept.join(' ')}"` : ''
  })
}

function dedent(lines: string[]): string[] {
  const indent = Math.min(...lines.filter(line => line.trim()).map(line => /^ */.exec(line)![0].length))
  return lines.map(line => line.slice(indent))
}

/** Points links to other pages at their Markdown, as full addresses an agent can fetch. */
function links(line: string, path: string): string {
  return line.replace(/\]\(([^)\s]+)\)/g, (link, target: string) => {
    if (/^(?:[a-z]+:|#)/i.test(target))
      return link
    // A link from the root, as VitePress reads it, starts at the base.
    const url = new URL(target.replace(/^\//, siteUrl), pageUrl(path, 'markdown'))
    if (!url.href.startsWith(siteUrl) || /\.(?!md$)\w+$/.test(url.pathname))
      return link
    if (!url.pathname.endsWith('.md'))
      url.pathname += '.md'
    return `](${url.href})`
  })
}

/** A `::: warning 0.x` container, as a quote with its title in bold. */
function callout(title: string, body: string[], path: string): string[] {
  return [`> **${title}**`, '>', ...body.map(line => (line ? `> ${links(line, path)}` : '>'))]
}

function capitalise(word: string): string {
  return word[0]!.toUpperCase() + word.slice(1)
}

/** A cell's text, safe inside a table row. */
function cell(text: string): string {
  return text.replace(/\s*\n\s*/g, ' ').replaceAll('|', '\\|')
}

function table(head: string[], rows: string[][]): string[] {
  return [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell).join(' | ')} |`),
  ]
}

// Reka's `as` and `asChild` are the same on every element component, so they get a line, not rows.
const inherited = ['as', 'asChild']

/** A component's props, events and slots, as the ApiTable on the page shows them. */
function apiTable(name: string, doc: ComponentDoc | undefined): string[] {
  if (!doc)
    return []
  const own = doc.props.filter(prop => !inherited.includes(prop.name))
  const polymorphic = doc.props.some(prop => prop.name === 'asChild')
  const out = [`**\`${name}\`**${polymorphic ? ' · takes Reka\'s `as` and `asChild`' : ''}`, '']

  if (own.length) {
    out.push(...table(['Prop', 'Type', 'Default', 'Description'], own.map(prop => [
      `\`${prop.name}\`${prop.required ? ' (required)' : ''}`,
      `\`${prop.type}\``,
      prop.default !== undefined && prop.default !== 'undefined' ? `\`${prop.default}\`` : '',
      prop.description,
    ])))
  }
  else {
    out.push('No props of its own.')
  }

  if (doc.events.length || doc.slots.length) {
    out.push('', ...table(['Event or slot', 'Description'], [
      ...doc.events.map(event => [`\`@${event.name}\``, event.description]),
      ...doc.slots.map(slot => [`\`#${slot.name}\``, slot.description || (slot.name === 'default' ? 'The content.' : '')]),
    ]))
  }
  return out
}

function swatchTable(data: PageData): string[] {
  const names = Object.keys(data.skins[0]!.colours)
  return table(
    ['Token', ...data.skins.map(skin => skin.name)],
    names.map(name => [`\`--fp-color-${name}\``, ...data.skins.map(skin => `\`${skin.colours[name]}\``)]),
  )
}

function pairTable(data: PageData): string[] {
  return table(
    ['Pair', 'Where', 'Needs', ...data.skins.map(skin => skin.name)],
    data.pairs.map(pair => [
      `\`${pair.fg}\` on \`${pair.bg}\``,
      pair.where,
      `${required[pair.kind]}:1`,
      ...data.skins.map(({ colours }) => {
        const [fg, bg] = [colours[pair.fg], colours[pair.bg]]
        if (!fg || !bg || !isOpaqueHex(fg) || !isOpaqueHex(bg))
          return ''
        const ratio = contrast(fg, bg)
        return `${ratio.toFixed(2)}:1${ratio < required[pair.kind] ? ' fails' : ''}`
      }),
    ]),
  )
}

function classList(classes: ClassDoc[]): string[] {
  return classes.flatMap(item => [
    `### .${item.name}`,
    '',
    item.doc,
    '',
    ...(item.states.length ? [`Responds to: ${item.states.map(state => `\`${state}\``).join(', ')}`, ''] : []),
  ])
}
