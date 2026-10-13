---
'@frontpanel/css': patch
---

A body inside `fp-device-rim` still takes the rim's 26 px curve by default, but a radius class on the body now wins over it. A rim sized another way (`rounded-[28px] p-1.5`, say) can give its body the matching radius, so the chrome band stays even at the corners.
