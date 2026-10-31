import type { Tokens } from '../scripts/generate.ts'

/*
 * The two skins. Chrome Silver is the full set; Gunmetal Night remaps the same names, so no class
 * knows the skin. Names drop the --fp- prefix, which the generator adds.
 *
 * One light source, top-left: bevels are light on the top and left edges and dark on the bottom
 * and right, and a pressed control inverts them. `color-ink-dim` passes WCAG AA only on matte
 * panels, never on the bare shell.
 */
export const tokens: Tokens = {
  silver: {
    'color-chrome-hi': '#ffffff',
    'color-chrome-100': '#e8ecf2',
    'color-chrome-300': '#b9c2cf',
    'color-chrome-500': '#7d8898',
    'color-chrome-800': '#3a4250',
    'color-chrome-tint': '#9fc6f0',
    // A scrollbar thumb, 3:1 against the wells and panels it scrolls over.
    'color-scroll-thumb': '#5d6776',

    // Device body, the matte panels that sit on it, recessed wells, and the text that reads off them.
    'color-shell': '#bcc5d1',
    'color-shell-hi': '#d3dae3',
    'color-shell-matte': '#d6dae0',
    'color-well': '#c7cfd9',
    'color-field': '#f4f6f9',
    'color-ink': '#1a1f29',
    'color-ink-soft': '#3a4250',
    'color-ink-dim': '#4d5664',

    // Bevels and edges. Separate tokens because a dark skin needs far weaker highlights.
    'color-bevel-hi': 'rgb(255 255 255 / 0.6)',
    'color-bevel-lo': 'rgb(0 0 0 / 0.16)',
    'color-edge': 'rgb(20 26 36 / 0.38)',
    'color-edge-strong': '#3a4250',
    'color-cast': 'rgb(20 28 44 / 0.18)',
    'color-grid': 'rgb(255 255 255 / 0.2)',

    'color-lcd-bg': '#a9c18a',
    'color-lcd-ink': '#1e2b14',
    'color-lcd-ghost': '#93ab76',

    'color-housing': '#3a4250',
    'color-housing-ink': '#e8ecf2',
    'color-led-on': '#39ff6a',
    'color-led-amber': '#ffb000',
    'color-led-red': '#ff4a3d',
    'color-led-off': '#1f252e',

    // Piano keys: knurled silver plastic in the slate well of the housing, its knurl a light and a
    // dark line. The plain strip is cream; the focus ring round a key is pale, since it sits in the
    // well, where the skin's dark-blue ring would vanish.
    'color-key-hi': '#e8ecf2',
    'color-key': '#b9c2cf',
    'color-key-lo': '#7d8898',
    'color-key-well': '#3a4250',
    'color-key-knurl-hi': 'rgb(255 255 255 / 0.3)',
    'color-key-knurl-lo': 'rgb(0 0 0 / 0.2)',
    'color-key-strip': '#ece5d3',
    'color-key-ring': '#8fbaff',

    // Molded caps: each colour travels with its label colour (see the fp-cap-* classes).
    'color-cap': '#f2f4f7',
    'color-cap-ink': '#2a303b',
    'color-cap-blue': '#2f6bc4',
    'color-cap-blue-ink': '#ffffff',
    'color-cap-amber': '#e8a33a',
    'color-cap-amber-ink': '#1e2b14',
    'color-cap-graphite': '#4a5262',
    'color-cap-graphite-ink': '#ffffff',
    'color-cap-berry': '#a93d5e',
    'color-cap-berry-ink': '#ffffff',

    'color-gel': '#1a56b0',
    'color-gel-hi': '#5d97e6',
    'color-gel-lo': '#113c80',
    'color-gel-ink': '#ffffff',

    'color-focus': '#4fd2ff',
    // The gel's blue, so focus shares the one accent; 3.2:1 on the page backdrop, its darkest ground.
    'color-focus-ring': '#1a56b0',
    // Ring around a selected cap: the skin's ink, dark on silver and light on gunmetal, so it reads on
    // every cap colour and never looks like the focus ring.
    'color-select': '#1a1f29',
    'color-error-text': '#b3261e',

    'color-backdrop': '#a3b0c3',
    'color-backdrop-hi': '#e2e8f0',

    'font-display': '"Michroma", "Arial Black", sans-serif',
    'font-lcd': '"VT323", "Courier New", monospace',
    'font-ui': 'Tahoma, Verdana, "Segoe UI", system-ui, sans-serif',
  },

  // Gunmetal Night: dark shell, amber backlit LCD.
  gunmetal: {
    'color-chrome-hi': '#a3adbc',
    'color-chrome-100': '#4b5361',
    'color-chrome-300': '#363c47',
    'color-chrome-500': '#22262e',
    'color-chrome-800': '#0e1115',
    'color-chrome-tint': '#36506c',
    'color-scroll-thumb': '#7a8491',

    'color-shell': '#22262e',
    'color-shell-hi': '#2a2f38',
    'color-shell-matte': '#2c313a',
    'color-well': '#1f232a',
    'color-field': '#1a1e25',
    'color-ink': '#e7eaf0',
    'color-ink-soft': '#bac1cc',
    'color-ink-dim': '#959daa',

    'color-bevel-hi': 'rgb(255 255 255 / 0.09)',
    'color-bevel-lo': 'rgb(0 0 0 / 0.45)',
    'color-edge': 'rgb(0 0 0 / 0.65)',
    'color-edge-strong': '#8e96a3',
    'color-cast': 'rgb(0 0 0 / 0.4)',
    'color-grid': 'rgb(255 255 255 / 0.035)',

    'color-lcd-bg': '#2b1d0a',
    'color-lcd-ink': '#ffb547',
    'color-lcd-ghost': '#3d2b11',

    'color-housing': '#0b0e12',
    'color-housing-ink': '#e7eaf0',

    'color-cap': '#d5dae1',
    'color-cap-graphite': '#5a6373',

    'color-focus-ring': '#4fd2ff',

    // Piano keys: dark molded plastic in a black well.
    'color-key-hi': '#5a5e65',
    'color-key': '#34373c',
    'color-key-lo': '#222428',
    'color-key-well': '#0b0c0e',
    'color-key-knurl-hi': 'rgb(255 255 255 / 0.11)',
    'color-key-knurl-lo': 'rgb(0 0 0 / 0.45)',
    'color-key-ring': '#4fd2ff',
    'color-select': '#e7eaf0',
    'color-error-text': '#ff8a80',

    'color-backdrop': '#0d1016',
    'color-backdrop-hi': '#1c2230',
  },
}
