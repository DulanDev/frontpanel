<script setup lang="ts">
import ComponentDeck from './ComponentDeck.vue'
import DevicePanel from './DevicePanel.vue'
import TokenReference from './TokenReference.vue'

// Every core class in both skins as raw classes, then the same parts as Vue components.
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
        Both skins: every core class, then a device built from the Vue components.
      </p>
    </header>

    <div class="skins">
      <DevicePanel v-for="skin in skins" :key="skin.id" :skin="skin" />
    </div>

    <section class="components" aria-labelledby="components-heading">
      <h2 id="components-heading">
        Components
      </h2>
      <p>
        <code>@frontpanel/vue</code>: drawn at 600 px and scaled to fit its column (<code>fit="width"</code>).
      </p>
      <div class="skins">
        <ComponentDeck v-for="skin in skins" :key="skin.id" :skin="skin" />
      </div>
    </section>

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

.components {
  display: grid;
  gap: 0.75rem;
}

.components h2,
.components p {
  margin: 0;
}

.components h2 {
  font-family: var(--fp-font-display);
  font-size: 1.125rem;
  letter-spacing: 0.08em;
}

.skins {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 30rem), 1fr));
  gap: 1rem;
}
</style>
