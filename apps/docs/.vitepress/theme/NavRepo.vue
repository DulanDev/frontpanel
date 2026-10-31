<script setup lang="ts">
import { version } from '../../../../packages/vue/package.json'

// The GitHub icon and the released version as one link to the repo, in place of VitePress's own
// GitHub icon in the nav bar (custom.css hides that one; its menus keep theirs). The CSS and Vue
// packages release together, so the Vue package's version stands for both.

const REPO = 'https://github.com/DulanDev/frontpanel'
// The GitHub mark, from Simple Icons (CC0), the set VitePress draws its own from.
const MARK = 'M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
</script>

<template>
  <div class="nav-repo">
    <a class="link" :href="REPO" target="_blank" rel="noopener" :aria-label="`GitHub, version ${version}`">
      <svg class="mark" viewBox="0 0 24 24" aria-hidden="true"><path :d="MARK" fill="currentColor" /></svg>
      <span class="version">v{{ version }}</span>
    </a>
  </div>
</template>

<style scoped>
/* From 1280px, where VitePress shows its GitHub icon; narrower, the nav's menus link the repo. */
.nav-repo {
  display: none;
  align-items: center;
}

@media (min-width: 1280px) {
  .nav-repo {
    display: flex;
  }
}

/* The divider VitePress draws before its own icon, outside the link and its focus ring. */
.nav-repo::before {
  width: 1px;
  height: 24px;
  margin-inline: 8px;
  background-color: var(--vp-c-divider);
  content: "";
}

.link {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding-inline: 8px;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.link:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.mark {
  width: 20px;
  height: 20px;
}

.version {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
</style>
