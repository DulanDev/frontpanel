# Motion

The moving parts are small and physical: a button travels 1 px when pressed, an LCD line redraws
left to right, an LED blinks twice to confirm an action, and the phone sheet slides in.

## Reduced motion

Nothing resets motion globally. Each class that moves handles `prefers-reduced-motion` itself:
under it, presses and transitions are instant, the redraw and the blink don't play, and the sheet
appears without sliding.

The sheet's transition lasts 1 ms rather than 0 under reduced motion. That reads as instant, but
a 0 ms transition fires no `transitionend`, so code waiting for the sheet to finish would wait
forever.

## Replaying an effect

`FpLcdLine redraw` replays its sweep whenever its text changes. `FpLed blink` blinks when it
lights; to blink a lit LED again, re-key it:

```vue
<FpLed :key="saves" color="amber" :lit="saves > 0" blink />
```
