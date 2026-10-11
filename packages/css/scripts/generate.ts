/*
 * One source, two outputs. The classes are written once, as Tailwind `@utility fp-*` blocks in
 * src/utilities.css; this turns them into plain `.fp-*` classes in @layer frontpanel for
 * components.css and keeps them as written for tailwind.css, so the two cannot drift. Anything
 * Tailwind-only, which a plain class could not express, is rejected. The tokens are data
 * (src/tokens.ts): Gunmetal lists only what differs from Silver and is written to both of its
 * selectors from that one list.
 */
import type { ChildNode, Container, Declaration, Node, Root } from 'postcss'
import postcss from 'postcss'

export interface Tokens {
  silver: Record<string, string>
  gunmetal: Record<string, string>
}

export interface Sources {
  utilities: string
  shared: string
  tokens: Tokens
}

export interface Outputs {
  'tokens.css': string
  'components.css': string
  'tailwind.css': string
}

export class GenerateError extends Error {
  override name = 'GenerateError'
}

export function generate(sources: Sources): Outputs {
  const utilities = parseUtilities(sources.utilities)
  const shared = parseShared(sources.shared)
  return {
    'tokens.css': tokensCss(sources),
    'components.css': componentsCss(utilities.clone(), shared.clone()),
    'tailwind.css': tailwindCss(utilities, shared, sources),
  }
}

/** Tailwind-only syntax, which a plain `.fp-*` class could not express. */
const tailwindOnlyAtRules = ['apply', 'variant', 'utility', 'theme', 'custom-variant', 'reference', 'plugin', 'config', 'source']
const tailwindOnlyFunctions = ['--value', '--modifier', '--alpha', '--spacing', '--theme', 'theme']

function parseUtilities(source: string): Root {
  const root = postcss.parse(source)
  for (const node of root.nodes) {
    if (node.type === 'rule')
      throw new GenerateError(`utilities.css holds only @utility blocks and comments, found ${node.selector}`)
    if (node.type === 'atrule' && node.name !== 'utility')
      throw new GenerateError(`utilities.css holds only @utility blocks and comments, found @${node.name} ${node.params}`)
  }
  const names = new Set<string>()
  root.each((utility) => {
    if (utility.type !== 'atrule')
      return
    const name = utility.params
    if (!name.startsWith('fp-'))
      throw new GenerateError(`${name}: utility names start with fp-`)
    if (name.endsWith('-*'))
      throw new GenerateError(`${name}: functional utilities have no plain-CSS form`)
    // The name becomes a selector in components.css, so it must be one plain class name.
    if (!/^fp-[a-z0-9-]+$/.test(name))
      throw new GenerateError(`${name}: utility names are fp- then lowercase letters, digits and dashes`)
    if (names.has(name))
      throw new GenerateError(`${name}: defined twice`)
    names.add(name)
    utility.walkAtRules('utility', (nested) => {
      throw new GenerateError(`${name}: a nested @utility is not allowed; declare ${nested.params} at the top level`)
    })
    rejectTailwindOnly(utility, name)
  })
  return root
}

/**
 * Shared rules are copied into both outputs as they are, so they must be plain CSS that styles
 * nothing outside `.fp-*`: no Tailwind syntax, no global selectors, `fp-` keyframe names.
 */
function parseShared(source: string): Root {
  const root = postcss.parse(source)
  rejectTailwindOnly(root, 'shared.css')
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes'))
      return
    for (const selector of rule.selectors) {
      if (!selector.startsWith('.fp-') || /\.(?!fp-)[a-z_-]/i.test(selector))
        throw new GenerateError(`shared.css: ${selector} is not scoped to fp- classes`)
    }
  })
  root.walkAtRules(/keyframes$/, (keyframes) => {
    if (!keyframes.params.startsWith('fp-'))
      throw new GenerateError(`shared.css: keyframes ${keyframes.params} is not fp- prefixed`)
  })
  return root
}

function rejectTailwindOnly(container: Container, label: string): void {
  container.walk((node) => {
    const fail = (construct: string): never => {
      throw new GenerateError(`${label}: ${construct} has no plain-CSS form`)
    }
    if (node.type === 'atrule' && tailwindOnlyAtRules.includes(node.name))
      fail(`@${node.name}`)
    const text = node.type === 'decl' ? node.value : node.type === 'atrule' ? node.params : ''
    for (const fn of tailwindOnlyFunctions) {
      if (new RegExp(`(^|[^\\w-])${fn}\\(`).test(text))
        fail(`${fn}()`)
    }
  })
}

/**
 * Silver is the full set. Gunmetal lists only what differs and is written twice from that one
 * list: for a dark system unless the root is forced silver, and on any element forced gunmetal.
 */
function tokensCss({ tokens }: Sources): string {
  for (const name of Object.keys(tokens.gunmetal)) {
    if (!(name in tokens.silver))
      throw new GenerateError(`${name}: gunmetal sets a token silver does not define`)
  }
  const silver = postcss.rule({ selector: ':root, [data-fp-skin="silver"]', nodes: declarations(tokens.silver) })
  const dark = postcss.atRule({
    name: 'media',
    params: '(prefers-color-scheme: dark)',
    nodes: [postcss.rule({ selector: ':root:not([data-fp-skin="silver"])', nodes: declarations(tokens.gunmetal) })],
  })
  const gunmetal = postcss.rule({ selector: '[data-fp-skin="gunmetal"]', nodes: declarations(tokens.gunmetal) })
  return format(postcss.root({ nodes: [postcss.atRule({ name: 'layer', params: 'frontpanel', nodes: [silver, dark, gunmetal] })] }))
}

function declarations(values: Record<string, string>): Declaration[] {
  return Object.entries(values).map(([name, value]) => postcss.decl({ prop: `--fp-${name}`, value }))
}

function componentsCss(root: Root, shared: Root): string {
  root.walkAtRules('utility', (utility) => {
    utility.replaceWith(postcss.rule({ selector: `.${utility.params}`, nodes: utility.nodes ?? [] }))
  })
  const layer = postcss.atRule({ name: 'layer', params: 'frontpanel', nodes: [...shared.nodes, ...root.nodes] })
  return format(postcss.root({ nodes: [layer] }))
}

/**
 * The tokens go in Tailwind's theme layer and the shared rules in its components layer, so its
 * utilities outrank both. `@theme inline` maps each colour and font to a var() of the token, so
 * `bg-fp-shell` changes with the skin.
 */
function tailwindCss(utilities: Root, shared: Root, { tokens }: Sources): string {
  const theme = postcss.atRule({ name: 'theme', params: 'inline' })
  for (const name of Object.keys(tokens.silver)) {
    const [, namespace, rest] = /^(color|font)-(.+)$/.exec(name) ?? []
    if (namespace)
      theme.append(postcss.decl({ prop: `--${namespace}-fp-${rest}`, value: `var(--fp-${name})` }))
  }
  return format(postcss.root({
    nodes: [
      postcss.atRule({ name: 'import', params: '"./tokens.css" layer(theme)' }),
      theme,
      postcss.atRule({ name: 'layer', params: 'components', nodes: shared.nodes }),
      ...utilities.nodes,
    ],
  }))
}

const banner = '/* Generated by scripts/build.ts from src/. Do not edit; edit the source and run `pnpm build`. */'

/**
 * Two-space indent by depth, a blank line between blocks (not after a doc comment), a semicolon
 * after every declaration. Multi-line values and comments shift with their node, so a gradient
 * keeps its own inner indentation.
 */
function format(root: Root): string {
  root.walk((node) => {
    const depth = depthOf(node)
    const indent = '  '.repeat(depth)
    const from = `\n${sourceIndent(node)}`
    const shift = (text = '') => text.replaceAll(from, `\n${indent}`)
    const first = node.parent?.first === node
    const tight = first || node.type === 'decl' || node.prev()?.type === 'comment'
    node.raws.before = depth === 0 && first ? '' : `${tight ? '\n' : '\n\n'}${indent}`
    if (node.type === 'comment') {
      node.text = shift(node.text)
      node.raws.right = shift(node.raws.right)
    }
    else if (node.type === 'decl') {
      node.raws.between = node.raws.between?.includes('\n') ? shift(node.raws.between) : ': '
      node.value = shift(node.value)
    }
    else if (node.type === 'rule' || node.type === 'atrule') {
      node.raws.between = node.type === 'atrule' && !node.nodes ? '' : ' '
      node.raws.after = `\n${indent}`
      node.raws.semicolon = true
    }
  })
  root.raws.after = '\n'
  return `${banner}\n${root.toString()}`
}

/** The indentation a parsed node had in its source; built nodes have none. */
function sourceIndent(node: ChildNode): string {
  return (node.raws.before ?? '').replace(/^[\s\S]*\n/, '')
}

function depthOf(node: ChildNode): number {
  let depth = 0
  for (let parent: Node | undefined = node.parent; parent && parent.type !== 'root'; parent = parent.parent)
    depth++
  return depth
}
