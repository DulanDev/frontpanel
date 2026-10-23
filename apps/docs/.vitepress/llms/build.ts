import type { PageData } from './transform'
import { readFile } from 'node:fs/promises'
import { contrastPairs } from '../../../../packages/css/src/contrast-pairs.ts'
import { tokens } from '../../../../packages/css/src/tokens.ts'
import classes from '../../reference/classes.data'
import components from '../../reference/components.data'
import { description, sidebar } from '../site'
import { pageMarkdown, pageUrl } from './transform'

/*
 * The docs for AI agents: every guide and reference page as Markdown at its own address with
 * `.md` added, `llms.txt` listing them, and `llms-full.txt` holding them all. The dev server
 * serves these and the build writes them beside the pages (see plugin.ts).
 */

const docs = new URL('../../', import.meta.url)

/** The guide and reference pages in sidebar order, by their path in the docs (`guide/skins.md`). */
export const sections = sidebar.map(section => ({
  text: section.text,
  pages: section.items
    .filter(item => !/\.\w+$/.test(item.link))
    .map(item => ({ title: item.text, path: `${item.link.slice(1)}.md` })),
}))

/** The data the generated tables are read from, the same the site's own tables use. */
export async function loadPageData(): Promise<PageData> {
  const pkg = JSON.parse(await readFile(new URL('../../packages/vue/package.json', docs), 'utf8')) as { version: string }
  const colours = (skin: Record<string, string>) => Object.fromEntries(Object.entries(skin)
    .filter(([name]) => name.startsWith('color-'))
    .map(([name, value]) => [name.slice('color-'.length), value]))
  return {
    version: pkg.version,
    components: await components.load([]),
    classes: await classes.load([]),
    // Gunmetal Night remaps only the names it changes; the rest are Chrome Silver's.
    skins: [
      { name: 'Chrome Silver', colours: colours(tokens.silver) },
      { name: 'Gunmetal Night', colours: colours({ ...tokens.silver, ...tokens.gunmetal }) },
    ],
    pairs: contrastPairs,
  }
}

/** Every file, by its path from the site root: each page's `.md`, `llms.txt` and `llms-full.txt`. */
export async function buildLlmsFiles(data: PageData): Promise<Map<string, string>> {
  const files = new Map<string, string>()
  for (const { pages } of sections) {
    for (const { path } of pages)
      files.set(path, pageMarkdown(await readFile(new URL(path, docs), 'utf8'), path, data))
  }

  files.set('llms.txt', [
    '# Frontpanel',
    '',
    `> ${description}`,
    '',
    `Frontpanel ${data.version}: \`@frontpanel/css\` is the skin (tokens and \`.fp-*\` classes, with a Tailwind 4 entry), and \`@frontpanel/vue\` adds Vue 3 components on Reka UI. Each page below is Markdown; ${pageUrl('llms-full.txt', 'markdown')} has them all in one file.`,
    ...sections.flatMap(({ text, pages }) => [
      '',
      `## ${text}`,
      '',
      ...pages.map(({ title, path }) => `- [${title}](${pageUrl(path, 'markdown')}): ${summary(files.get(path)!)}`),
    ]),
    '',
  ].join('\n'))

  files.set('llms-full.txt', sections
    .flatMap(({ pages }) => pages.map(({ path }) => files.get(path)!))
    .join('\n---\n\n'))

  return files
}

/** A page's first sentence, after its title and source line. */
function summary(markdown: string): string {
  const paragraph = markdown.split('\n\n').find(block => /^[A-Z`]/.test(block)) ?? ''
  const text = paragraph.replace(/\s*\n\s*/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  return /^.*?\.(?=\s|$)/.exec(text)?.[0] ?? text
}
