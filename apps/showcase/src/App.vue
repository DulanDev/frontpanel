<script setup lang="ts">
import DevicePanel from './DevicePanel.vue'
import TokenReference from './TokenReference.vue'

// Phase 1 check: every core class in both skins, as raw classes before any Vue component exists.
const skins = [
  { id: 'silver', name: 'Chrome Silver' },
  { id: 'gunmetal', name: 'Gunmetal Night' },
] as const
</script>

<template>
  <main class="page">
    <header class="intro">
      <h1>Frontpanel</h1>
      <p>
        The UI kit behind <a href="https://whatsthenextchord.com">WhatsTheNextChord</a>.
        Both skins, every core class, before the components land.
      </p>
    </header>

    <div class="skins">
      <DevicePanel v-for="skin in skins" :key="skin.id" :skin="skin" />
    </div>

    <TokenReference />
  </main>
</template>

<style scoped>
.page {
  display: grid;
  gap: 1.5rem;
  max-width: 72rem;
  margin-inline: auto;
  padding: 1.5rem 1rem 3rem;
}

.intro h1 {
  margin: 0;
  font-family: var(--fp-font-display);
  font-size: 1.5rem;
  letter-spacing: 0.08em;
}

.skins {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 30rem), 1fr));
  gap: 1rem;
}
</style>
