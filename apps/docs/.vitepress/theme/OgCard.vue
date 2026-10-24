<script setup lang="ts">
import DeckDemo from './demos/DeckDemo.vue'

// The link preview, laid out at the 1200 x 630 the sites ask for and screenshotted by the record
// script: the name and pitch on the left, and the desk player in both skins on the right, the
// Silver one standing in front of the Gunmetal one, on the Gunmetal backdrop.
</script>

<template>
  <div class="og fp-device-backdrop" data-fp-skin="gunmetal">
    <div class="copy">
      <p class="name">
        Frontpanel
      </p>
      <p class="pitch">
        Early-2000s hardware, in the browser
      </p>
      <p class="parts">
        Liquid chrome, gel buttons, LCD readouts and LEDs, in plain CSS with Vue 3 components.
      </p>
      <p class="credit">
        The UI kit behind WhatsTheNextChord
      </p>
    </div>
    <div class="unit back vp-raw" data-fp-skin="gunmetal">
      <DeckDemo hero />
    </div>
    <div class="unit front vp-raw" data-fp-skin="silver">
      <DeckDemo hero />
    </div>
  </div>
</template>

<style scoped>
.og {
  position: relative;
  width: 1200px;
  height: 630px;
  overflow: hidden;
  color: var(--fp-color-ink);
  font-family: var(--fp-font-ui);
}

.copy {
  position: absolute;
  inset: 64px auto 56px 64px;
  display: flex;
  flex-direction: column;
  width: 410px;
}

.name {
  margin: 0;
  font-family: var(--fp-font-display);
  font-size: 58px;
  line-height: 1;
  letter-spacing: 0.01em;
}

.pitch {
  margin: 28px 0 0;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.12;
}

.parts {
  margin: 22px 0 0;
  color: var(--fp-color-ink-soft);
  font-size: 21px;
  line-height: 1.45;
}

.credit {
  margin: auto 0 0;
  color: var(--fp-color-ink-soft);
  font-size: 18px;
}

.unit {
  position: absolute;
  width: 600px;
}

.back {
  top: 48px;
  right: -56px;
}

.front {
  top: 268px;
  right: 64px;
  filter: drop-shadow(0 18px 28px rgb(0 0 0 / 0.45));
}
</style>
