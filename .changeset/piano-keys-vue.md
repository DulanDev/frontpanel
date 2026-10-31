---
'@frontpanel/vue': minor
---

`FpRadioGroup`, `FpCheckbox` and `FpCheckboxGroup`: latching piano keys on Reka's RadioGroup, Checkbox and CheckboxGroup. Each takes `options` of `{ value, label, disabled?, color? }` (`FpCheckbox` takes one `label`), a `label` for the group, `orientation`, `color` and `led`: `strip` (the default) lights the strip on the latched key, `above` puts an LED over each label, `none` has no light. `FpRadioGroup` binds the chosen value, `FpCheckboxGroup` the latched values, `FpCheckbox` a boolean.
