<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
// The docs are private and in the same workspace, so they read the css package's sources.
import { contrastPairs } from '../../../../../packages/css/src/contrast-pairs.ts'
import { contrast, isOpaqueHex, required } from '../../../../../packages/css/src/contrast.ts'
import { tokens } from '../../../../../packages/css/src/tokens.ts'

// Which half to show: the swatches of both skins, or the checked pairs.
const props = defineProps<{ show: 'swatches' | 'pairs' }>()
const skins = [
  { id: 'silver', name: 'Chrome Silver' },
  { id: 'gunmetal', name: 'Gunmetal Night' },
] as const
type SkinId = typeof skins[number]['id']

const colours = Object.keys(tokens.silver)
  .filter(name => name.startsWith('color-'))
  .map(name => name.slice('color-'.length))

// Read from the stylesheet as it renders, so the page shows what ships, or a custom skin's values.
const probes = useTemplateRef<HTMLElement[]>('probes')
const values = ref<Record<SkinId, Record<string, string>>>({ silver: {}, gunmetal: {} })

onMounted(() => {
  for (const probe of probes.value ?? []) {
    const style = getComputedStyle(probe)
    values.value[probe.dataset.fpSkin as SkinId] = Object.fromEntries(
      colours.map(name => [name, style.getPropertyValue(`--fp-color-${name}`).trim()]),
    )
  }
})

function ratio(skin: SkinId, fg: string, bg: string): number | undefined {
  const [fore, back] = [values.value[skin][fg], values.value[skin][bg]]
  return fore && back && isOpaqueHex(fore) && isOpaqueHex(back) ? contrast(fore, back) : undefined
}

const colour = (name: string) => `var(--fp-color-${name})`
</script>

<template>
  <div class="tokens">
    <!-- One hidden element per skin to read its values from, whichever half is shown. -->
    <span v-for="skin in skins" ref="probes" :key="skin.id" :data-fp-skin="skin.id" hidden />
    <div v-if="props.show === 'swatches'" class="panels">
      <div
        v-for="skin in skins"
        :key="skin.id"
        :data-fp-skin="skin.id"
        class="fp-module panel"
      >
        <h3 class="fp-silk">
          {{ skin.name }}
        </h3>
        <ul class="swatches">
          <li v-for="name in colours" :key="name" class="swatch">
            <span class="chip" :style="{ background: colour(name) }" />
            <code>{{ name }}</code>
            <span class="value">{{ values[skin.id][name] }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">
              Pair
            </th>
            <th scope="col">
              Where
            </th>
            <th scope="col">
              Needs
            </th>
            <th v-for="skin in skins" :key="skin.id" scope="col">
              {{ skin.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pair in contrastPairs" :key="`${pair.fg}/${pair.bg}`">
            <th scope="row">
              <code>{{ pair.fg }}</code> on <code>{{ pair.bg }}</code>
            </th>
            <td>{{ pair.where }}</td>
            <td>{{ required[pair.kind] }}:1</td>
            <td v-for="skin in skins" :key="skin.id" :data-fp-skin="skin.id">
              <span
                class="sample"
                aria-hidden="true"
                :style="pair.kind === 'text'
                  ? { color: colour(pair.fg), background: colour(pair.bg) }
                  : { background: colour(pair.bg), boxShadow: `inset 0 0 0 4px ${colour(pair.fg)}` }"
              >{{ pair.kind === 'text' ? 'Aa' : '' }}</span>
              <template v-if="ratio(skin.id, pair.fg, pair.bg) !== undefined">
                {{ ratio(skin.id, pair.fg, pair.bg)!.toFixed(2) }}:1
                <strong v-if="ratio(skin.id, pair.fg, pair.bg)! < required[pair.kind]">fails</strong>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 30rem), 1fr));
  gap: 1rem;
}

.panel {
  padding: 0.75rem 1rem 1rem;
  color: var(--fp-color-ink);
}

.panel h3 {
  margin: 0 0 0.75rem;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  gap: 0.375rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 12px;
}

.swatch {
  display: grid;
  grid-template-columns: 1.5rem 1fr auto;
  align-items: center;
  gap: 0.5rem;
}

.chip {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 4px;
  box-shadow: 0 0 0 1px var(--fp-color-edge);
}

.value {
  color: var(--fp-color-ink-soft);
  font-variant-numeric: tabular-nums;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 0.375rem 0.625rem;
  border-bottom: 1px solid var(--fp-color-edge);
  text-align: start;
  white-space: nowrap;
}

tbody th {
  font-weight: 400;
}

.sample {
  display: inline-grid;
  place-items: center;
  width: 2rem;
  height: 1.5rem;
  margin-inline-end: 0.375rem;
  border-radius: 4px;
  vertical-align: middle;
  font-weight: 700;
}
</style>
