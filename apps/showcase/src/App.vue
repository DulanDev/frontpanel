<script setup lang="ts">
// Phase 1 check: every core class in both skins, as raw classes before any Vue component exists.
const skins = [
  { id: 'silver', name: 'Chrome Silver' },
  { id: 'gunmetal', name: 'Gunmetal Night' },
] as const

const caps = [
  { label: 'C', variant: '' },
  { label: 'Am', variant: 'fp-cap-blue' },
  { label: 'G7', variant: 'fp-cap-amber' },
  { label: 'E5', variant: 'fp-cap-graphite' },
  { label: 'Fmaj7', variant: 'fp-cap-berry' },
]

const tracks = ['01 Intro', '02 Chrome Horizon', '03 Gel Pressure', '04 Silkscreen', '05 Backlight', '06 Two Blinks', '07 Rim Light', '08 Outro']
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
      <section
        v-for="skin in skins"
        :key="skin.id"
        :data-fp-skin="skin.id"
        class="fp-device-backdrop skin"
        :aria-label="skin.name"
      >
        <div class="fp-device-rim">
          <div class="fp-device-body body">
            <div class="fp-module">
              <div class="fp-module-title">
                <span class="fp-screw" aria-hidden="true" />
                <span class="fp-silk">{{ skin.name }}</span>
                <span class="fp-screw push" aria-hidden="true" />
              </div>

              <div class="stack">
                <div class="fp-lcd lcd">
                  <span class="lcd-line">NOW PLAYING 02:41</span>
                  <span class="lcd-line fp-lcd-redraw">CHROME HORIZON</span>
                </div>

                <div class="row">
                  <span class="fp-housing">
                    <span class="fp-led fp-led-green fp-led-lit" /> PWR
                  </span>
                  <span class="fp-housing">
                    <span class="fp-led fp-led-amber fp-led-lit fp-blink-twice" /> REC
                  </span>
                  <span class="fp-housing">
                    <span class="fp-led fp-led-red" /> CLIP
                  </span>
                </div>

                <div class="row">
                  <button type="button" class="fp-chrome-btn">
                    Prev
                  </button>
                  <button type="button" class="fp-chrome-btn" aria-pressed="true">
                    Play
                  </button>
                  <button type="button" class="fp-chrome-btn">
                    Next
                  </button>
                  <button type="button" class="fp-chrome-btn" disabled>
                    Eject
                  </button>
                  <button type="button" class="fp-gel">
                    Save
                  </button>
                </div>

                <div class="row" role="group" aria-label="Caps">
                  <button
                    v-for="(cap, index) in caps"
                    :key="cap.label"
                    type="button"
                    class="fp-cap" :class="[cap.variant]"
                    :aria-pressed="index === 1"
                  >
                    {{ cap.label }}
                  </button>
                </div>

                <div class="fp-well well">
                  <span class="fp-silk">Playlist</span>
                  <ol class="fp-scroll-thin playlist">
                    <li v-for="track in tracks" :key="track">
                      {{ track }}
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="fp-chrome chrome-strip" aria-hidden="true" />
            <div class="fp-chrome-soft chrome-strip silk-strip">
              <span class="fp-silk">Brushed chrome</span>
            </div>
          </div>
        </div>
      </section>
    </div>
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

.skin {
  padding: 1.5rem;
  border-radius: 12px;
  color: var(--fp-color-ink);
}

.body {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 28px;
}

.push {
  margin-inline-start: auto;
}

.stack {
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.lcd {
  display: grid;
  padding: 0.5rem 0.75rem;
  font-family: var(--fp-font-lcd);
  font-size: 1.5rem;
  line-height: 1.1;
}

.well {
  display: grid;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem;
}

.playlist {
  max-height: 6.5rem;
  margin: 0;
  padding-inline-start: 1.25rem;
  overflow-y: auto;
  font-size: 13px;
}

.chrome-strip {
  height: 1.5rem;
  border-radius: 6px;
}

.silk-strip {
  display: grid;
  place-items: center;
}
</style>
