# Accessibility

Frontpanel supplies the look; behaviour and ARIA come from [Reka UI](https://reka-ui.com) and from
your markup. What the kit guarantees:

- **Contrast.** Every text pairing passes WCAG AA (4.5:1) in both skins, and borders, rings and
  lit LEDs pass 3:1. A test checks the [pairs](../reference/tokens#checked-pairs) against the
  shipped stylesheet.
- **Focus.** Every interactive class carries its own focus ring: a solid outline with a glow
  outside it, since a glow alone fails non-text contrast on light chrome. It shows on keyboard
  focus only, and stays while the control is hovered.
- **State is physical and named.** A pressed toggle holds down *and* sets `aria-pressed`; a
  selected cap is pressed in with a ring, never shown by colour alone.
- **Forced colours** (such as Windows high contrast) drop the chrome, gradients and shadows, so
  each part is redrawn in the user's own system colours: controls and panels keep an edge, a
  pressed or selected control is filled with the selected colour, a disabled button greys, and
  the values stay in view (a knob's mark, a fader's cap, lit LEDs and meter segments, a
  readout's lit digits). The finishes (chrome strips, screws) go, as decoration should.
- **Motion** respects `prefers-reduced-motion`, per component. See [Motion](./motion).

## What's up to you

- **LEDs and icons are decorative** (`aria-hidden`) unless you give them a `label`, which makes
  them an image with that name. Say what an LED means in text nearby, or label it.
- **An icon-only button needs a name.** Put `aria-label` on the `FpButton` and leave the `FpIcon`
  inside it decorative:

  ```vue
  <FpButton aria-label="Next track">
  <FpIcon name="right" />
  </FpButton>
  ```

- **`pressed` makes a toggle.** Leave it unset for an ordinary button, which then gets no
  `aria-pressed`.
- **Return focus when a window closes.** Closing an `FpWindow` removes its focused close button;
  move focus back to the control that opened it.
- **Name things with real elements.** `FpSilk` is a span: render it as a heading or `label`
  (`as="h3"`, `as="label"`) where it names something. Give `FpWindow` the right heading `level`
  for its place in the page.
- **With plain classes,** use the ARIA attributes the classes style (`aria-pressed`,
  `aria-expanded`, `aria-current`) rather than your own state classes, and the look follows.
