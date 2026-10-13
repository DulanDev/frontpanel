<script setup lang="ts">
import ClassSheet from '../.vitepress/theme/demos/ClassSheet.vue'
import { data as classes } from './classes.data'

const skins = [
  { id: 'silver', name: 'Chrome Silver' },
  { id: 'gunmetal', name: 'Gunmetal Night' },
] as const

// Backticks in a doc comment become inline code; everything else is plain text.
function render(doc: string): string {
  return doc
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

const core = classes.filter(item => item.entry === 'core')
const page = classes.filter(item => item.entry === 'page')
</script>

# Classes

Every `.fp-*` class, read from the CSS source at build time. In plain CSS they live in
`components.css` (or `page.css`), inside `@layer frontpanel`; in Tailwind they are utilities, so
`lg:fp-module` and the like work. Each interactive class carries its own focus ring and handles
reduced motion.

"Responds to" lists the states a class styles: `aria-pressed`, hover and focus, and the input and
motion queries. Use the ARIA attributes the class expects, and the right look follows.

Every core class on one device, built from plain classes alone, in both skins:

<div class="vp-raw demo class-sheets">
  <ClassSheet v-for="skin in skins" :key="skin.id" :skin="skin" />
</div>

## Core

`index.css`, `components.css`, `tailwind.css`.

<div class="class-list">
  <section v-for="item in core" :key="item.name" class="class-item">
    <h3 :id="item.name"><code>.{{ item.name }}</code></h3>
    <p v-html="render(item.doc)" />
    <details v-if="item.states.length">
      <summary>Responds to</summary>
      <ul>
        <li v-for="state in item.states" :key="state"><code>{{ state }}</code></li>
      </ul>
    </details>
  </section>
</div>

## Page extra

`page.css`, `tailwind-page.css`: pieces for a website around a device.

<div class="class-list">
  <section v-for="item in page" :key="item.name" class="class-item">
    <h3 :id="item.name"><code>.{{ item.name }}</code></h3>
    <p v-html="render(item.doc)" />
    <details v-if="item.states.length">
      <summary>Responds to</summary>
      <ul>
        <li v-for="state in item.states" :key="state"><code>{{ state }}</code></li>
      </ul>
    </details>
  </section>
</div>

<style>
.class-sheets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
}

.class-item h3 {
  margin-top: 32px;
}

.class-item details {
  margin-top: 8px;
  color: var(--vp-c-text-2);
}

.class-item summary {
  cursor: pointer;
}
</style>
