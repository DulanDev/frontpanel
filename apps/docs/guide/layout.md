# Layout and input

Layout is yours. A device can **scale as a whole**, drawn at one design size like a picture of
hardware, or **reflow** its modules at your own breakpoints like a page. Frontpanel allows both,
so its classes carry no viewport breakpoints: modules size to their container.

## Scaling a device to fit

`FpDevice` with `fit` draws the device at its design `width` (rim included) and scales it to the
room it has.

```vue
<FpDevice fit="width" :width="600">
  ...
</FpDevice>
```

| `fit` | What it does |
| --- | --- |
| `none` (default) | Leaves layout to the page: the device fills its box, and its modules reflow at your breakpoints |
| `width` | Scales the device to the width it has. Its height follows |
| `contain` | Scales it to fit both sides. The box needs a height of its own |

`maxScale` (default `1`) keeps the device from growing past its design size; `height` fixes the
design height instead of measuring it. The device stays hidden until its first measurement, so it
never flashes at the wrong size.

## Reflowing modules

Leave `fit` at `none`, or use the classes directly, and lay the modules out with your own grid
and breakpoints. With Tailwind, every class takes variants:

```html
<div class="sm:fp-device-rim">
  <div class="fp-device-body grid gap-3 lg:grid-cols-2">
    <section class="fp-module">...</section>
    <section class="fp-module">...</section>
  </div>
</div>
```

A body set in the rim follows the rim's curve. If you size the rim another way, give the body a
matching radius with a class; it wins over the rim's.

## Control sizes follow the input

Controls are **44 px** tall by default, a comfortable touch target, and **36 px** under a precise
pointer (`@media (pointer: fine)`: a mouse, trackpad or stylus). The size follows how someone
points, not how wide the screen is, so a touch laptop gets 44 px and a narrow desktop window
36 px.
