import { readFile } from 'node:fs/promises'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

// The docs site's class reference is built from these comments, so every class needs one.
const sources = ['utilities.css', 'page/utilities.css']

const utilities = await Promise.all(sources.map(async (file) => {
  const root = postcss.parse(await readFile(new URL(file, import.meta.url), 'utf8'))
  return root.nodes.flatMap(node => node.type === 'atrule' && node.name === 'utility' ? [{ file, node }] : [])
})).then(lists => lists.flat())

describe('the class reference', () => {
  it.each(utilities.map(({ file, node }) => [node.params, file, node] as const))('%s has a doc comment', (_name, _file, node) => {
    const comment = node.prev()

    // A doc comment opens with /**, which postcss keeps as a leading * in the text.
    expect(comment?.type === 'comment' && comment.text.startsWith('*') ? comment.text.slice(1).trim() : undefined).toBeTruthy()
  })

  // The class page promises every core class on one device, in both skins, so a new class has to
  // be added to the sheet too.
  it('shows every core class on the class sheet', async () => {
    const sheet = await readFile(new URL('../../../apps/docs/.vitepress/theme/demos/ClassSheet.vue', import.meta.url), 'utf8')
    const core = utilities.filter(({ file }) => file === 'utilities.css').map(({ node }) => node.params)
    expect(core.filter(name => !new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(sheet))).toEqual([])
  })
})
