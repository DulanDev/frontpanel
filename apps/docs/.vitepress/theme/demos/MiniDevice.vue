<script setup lang="ts">
import { FpDevice, FpScrew, FpSilk } from '@frontpanel/vue'

// The shell the home page's small devices share: a rimmed body drawn at 340 px and scaled to its
// column, its name silkscreened along the top between two screws, and any lamps at the top right.
const { name } = defineProps<{ name: string }>()
</script>

<template>
  <FpDevice fit="width" :width="340" :backdrop="false" class="mini">
    <div class="body">
      <header class="top">
        <FpScrew />
        <FpSilk as="h3" class="name">
          {{ name }}
        </FpSilk>
        <div class="end">
          <slot name="lamps" />
          <FpScrew />
        </div>
      </header>
      <slot />
    </div>
  </FpDevice>
</template>

<style scoped>
.mini {
  color: var(--fp-color-ink);
}

.body {
  display: grid;
  gap: 0.75rem;
  padding: 0.875rem;
}

.top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

.name {
  margin: 0;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.2em;
}

.end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
}
</style>
