---
'@frontpanel/css': patch
---

`fp-chrome-btn`, `fp-gel` and `fp-cap` keep their focus glow while hovered. The hover brightness outranked the focus rule's filter, so a keyboard-focused control under the pointer kept only its outline.
