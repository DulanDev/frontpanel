import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineLoader } from 'vitepress'
import { createChecker } from 'vue-component-meta'

// Each component's props, events and slots, read from its types and TSDoc at build time.
export interface PropDoc {
  name: string
  type: string
  default?: string
  required: boolean
  description: string
}

export interface ComponentDoc {
  props: PropDoc[]
  events: { name: string, description: string }[]
  slots: { name: string, description: string }[]
}

declare const data: Record<string, ComponentDoc>
export { data }

const src = fileURLToPath(new URL('../../../packages/vue/src/', import.meta.url))
const tsconfig = fileURLToPath(new URL('../../../packages/vue/tsconfig.json', import.meta.url))

export default defineLoader({
  // Relative to this file.
  watch: ['../../../packages/vue/src/*.vue'],
  load(): Record<string, ComponentDoc> {
    const checker = createChecker(tsconfig, { schema: false, printer: { newLine: 1 } })
    const files = readdirSync(src).filter(file => /^Fp\w+\.vue$/.test(file))
    return Object.fromEntries(files.map((file) => {
      const meta = checker.getComponentMeta(src + file)
      return [file.replace(/\.vue$/, ''), {
        props: meta.props
          .filter(prop => !prop.global)
          .map(prop => ({
            name: prop.name,
            type: prop.type.replace(/\s*\|\s*undefined$/, ''),
            default: prop.default,
            required: prop.required,
            description: prop.description,
          })),
        events: meta.events.map(event => ({ name: event.name, description: event.description })),
        slots: meta.slots.map(slot => ({ name: slot.name, description: slot.description })),
      }]
    }))
  },
})
