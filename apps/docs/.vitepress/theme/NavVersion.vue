<script setup lang="ts">
import { version } from '../../../../packages/vue/package.json'

// The released version, after the GitHub link in the nav bar, opening the changelog. The CSS and
// Vue packages release together, so the Vue package's version stands for both.

const CHANGELOG = 'https://github.com/DulanDev/frontpanel/blob/main/packages/vue/CHANGELOG.md'
</script>

<template>
  <a class="nav-version" :href="CHANGELOG" :aria-label="`Version ${version}, changelog`">v{{ version }}</a>
</template>

<style scoped>
.nav-version {
  display: none;
  margin-inline-start: 12px;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.25s;
}

.nav-version:hover {
  color: var(--vp-c-text-1);
}

/* Under 768px the nav folds into its menu, and the version stays out of the crowded bar. */
@media (min-width: 768px) {
  .nav-version {
    display: inline-block;
  }
}
</style>
