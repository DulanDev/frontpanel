import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { defineLoader } from 'vitepress'

// The class reference, read from the CSS sources at build time so it can't drift from them.
export interface ClassDoc {
  name: string
  /** Which entry ships it: the core (index.css, tailwind.css) or the page extra. */
  entry: 'core' | 'page'
  doc: string
  /** The states and conditions it responds to: nested selectors, with `&` as the class, and @media queries. */
  states: string[]
}

declare const data: ClassDoc[]
export { data }

const sources = [
  { file: '../../../packages/css/src/utilities.css', entry: 'core' },
  { file: '../../../packages/css/src/page/utilities.css', entry: 'page' },
] as const

const files = sources.map(({ file }) => new URL(file, import.meta.url))

export default defineLoader({
  watch: sources.map(({ file }) => file),
  load(): ClassDoc[] {
    return sources.flatMap(({ entry }, index) => {
      const root = postcss.parse(readFileSync(files[index]!, 'utf8'))
      return root.nodes.flatMap((node) => {
        if (node.type !== 'atrule' || node.name !== 'utility')
          return []
        const comment = node.prev()
        const doc = comment?.type === 'comment' ? comment.text.replace(/^\*/, '').replace(/^\s*\* ?/gm, '').trim() : ''
        const states = new Set<string>()
        node.walk((child) => {
          if (child.type === 'rule')
            states.add(child.selector.replace(/\s+/g, ' ').replaceAll('&', `.${node.params}`))
          else if (child.type === 'atrule' && child.name === 'media')
            states.add(`@media ${child.params}`)
        })
        return [{ name: node.params, entry, doc, states: [...states] }]
      })
    })
  },
})
