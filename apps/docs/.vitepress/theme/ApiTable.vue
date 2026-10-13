<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../../reference/components.data'

// The props, events and slots of one component, from its types and TSDoc.
const props = defineProps<{ name: string }>()

const doc = computed(() => data[props.name])

// Reka's `as` and `asChild` are the same on every element component, so they get a line, not rows.
const inherited = ['as', 'asChild']
const own = computed(() => doc.value?.props.filter(prop => !inherited.includes(prop.name)) ?? [])
const polymorphic = computed(() => doc.value?.props.some(prop => prop.name === 'asChild') ?? false)

// Backticks in TSDoc become inline code; everything else is plain text.
function render(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
</script>

<template>
  <template v-if="doc">
    <p class="api-name">
      <code>{{ props.name }}</code><template v-if="polymorphic">
        · takes Reka's <code>as</code> and <code>asChild</code>
      </template>
    </p>
    <table v-if="own.length">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in own" :key="prop.name">
          <td><code>{{ prop.name }}</code><span v-if="prop.required" title="Required">*</span></td>
          <td><code>{{ prop.type }}</code></td>
          <td><code v-if="prop.default !== undefined && prop.default !== 'undefined'">{{ prop.default }}</code></td>
          <td v-html="render(prop.description)" />
        </tr>
      </tbody>
    </table>
    <p v-else>
      No props of its own.
    </p>
    <table v-if="doc.events.length || doc.slots.length">
      <thead>
        <tr>
          <th>Event or slot</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in doc.events" :key="`event-${event.name}`">
          <td><code>@{{ event.name }}</code></td>
          <td v-html="render(event.description)" />
        </tr>
        <tr v-for="slot in doc.slots" :key="`slot-${slot.name}`">
          <td><code>#{{ slot.name }}</code></td>
          <td v-html="render(slot.description || (slot.name === 'default' ? 'The content.' : ''))" />
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style scoped>
.api-name {
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
}
</style>
