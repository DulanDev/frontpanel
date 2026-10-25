<script setup lang="ts">
import ChordPadDemo from './ChordPadDemo.vue'
import ClockRadioDemo from './ClockRadioDemo.vue'
import MixerDemo from './MixerDemo.vue'
import RhythmDemo from './RhythmDemo.vue'

// The row of small devices under the home page's feature cards: four other kinds of device built
// from the same parts as the hero's player, each working, each with a link to its source.

const SOURCE = 'https://github.com/DulanDev/frontpanel/blob/main/apps/docs/.vitepress/theme/demos/'

const devices = [
  { component: MixerDemo, file: 'MixerDemo.vue', caption: 'Faders, mute and solo, and a meter for each channel.' },
  { component: RhythmDemo, file: 'RhythmDemo.vue', caption: 'Pick a voice, key in its steps and press Play.' },
  { component: ClockRadioDemo, file: 'ClockRadioDemo.vue', caption: 'Your time, an alarm, and a dial with four stations.' },
  { component: ChordPadDemo, file: 'ChordPadDemo.vue', caption: 'Tap a progression, then ask the app what comes next.' },
]
</script>

<template>
  <section class="home-devices vp-raw" aria-labelledby="home-devices-title">
    <div class="container">
      <h2 id="home-devices-title" class="title">
        Same parts, other devices
      </h2>
      <p class="lede">
        Each of these is built from the components above, and each one works.
      </p>
      <div class="grid">
        <figure v-for="device in devices" :key="device.file" class="item">
          <component :is="device.component" />
          <figcaption class="caption">
            {{ device.caption }}
            <a :href="SOURCE + device.file" class="source">Source</a>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The feature cards' side padding and width, so the row lines up under them. */
.home-devices {
  padding: 48px 24px 64px;
}

@media (min-width: 640px) {
  .home-devices {
    padding-inline: 48px;
  }
}

@media (min-width: 960px) {
  .home-devices {
    padding-inline: 32px;
  }
}

.container {
  max-width: 1216px;
  margin: 0 auto;
}

.title {
  margin: 0;
  color: var(--fp-color-ink);
  font-family: var(--fp-font-display);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.lede {
  margin: 8px 0 24px;
  color: var(--fp-color-ink);
  font-size: 15px;
}

/*
 * Four across on a wide screen, fewer as it narrows. Each item spans two of the grid's rows, so
 * the devices stand on one line, whatever their heights, and the captions start on the next.
 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0 24px;
}

.item {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  gap: 12px;
  margin: 0 0 32px;
}

.item > :first-child {
  align-self: end;
}

.caption {
  color: var(--fp-color-ink);
  font-size: 14px;
  line-height: 1.5;
}

.source {
  color: var(--fp-color-focus-ring);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
