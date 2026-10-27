# Coding standards

What spans packages. Rules for one package live in that package's `AGENTS.md`.

## Device model

A device is a chassis of modules and display windows. Physical controls carry the interaction:
knobs, faders, switches, buttons with LEDs, readouts, meters. State shows physically (a pressed
bevel, a lit LED). Text is silkscreened labels and readouts. Overlays are device parts: a window, a
faceplate menu, an LCD tag.

## Single-file components

Every SFC has one `<script setup lang="ts">` block and no other `<script>`.
