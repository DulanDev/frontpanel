/*
 * The desk player's display logic, kept apart from its timers: the time counter, a long title
 * stepping across the LCD, and the made-up signal the level meters follow (there is no audio).
 */

/** Seconds as the counter shows them, `mm:ss`. */
export function clock(seconds: number): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

/** Blank cells between the end of a scrolling title and its start coming round again. */
const GAP = '    '
/** Steps the title rests on its start before each pass, so it can be read. */
const REST = 4

/**
 * The cells of a title the LCD shows at a step of its scroll. A title that fits stays still; a
 * longer one rests on its start, then moves a cell to the left each step, round through a gap.
 */
export function marqueeFrame(title: string, cells: number, step: number): string {
  if (title.length <= cells)
    return title
  const loop = title + GAP
  const at = step % (REST + loop.length - 1)
  const offset = at < REST ? 0 : at - REST + 1
  return (loop + loop).slice(offset, offset + cells)
}

/**
 * A level from 0 to 1 at a moment of play, in milliseconds: a beat at 120 bpm that kicks and
 * decays, over a slower swell, with the right channel a little out of step with the left.
 */
export function levelAt(ms: number, channel: 0 | 1): number {
  const beat = Math.exp(-(ms % 500) / 140)
  const swell = Math.sin(ms / 900 + channel * 1.3)
  const flutter = Math.sin(ms / 63 + channel * 2.1) * Math.sin(ms / 211)
  return Math.min(1, Math.max(0, 0.5 + 0.32 * beat + 0.12 * swell + 0.08 * flutter))
}

/**
 * The levels of a spectrum display's bands at a moment of play, low to high, each 0 to 1: the
 * beat lands in the low bands, and each band flickers on its own beside it.
 */
export function bandsAt(ms: number, count: number): number[] {
  const beat = Math.exp(-(ms % 500) / 160)
  return Array.from({ length: count }, (_, index) => {
    const low = 1 - index / count
    const own = 0.5 + 0.5 * Math.sin(ms / (90 + index * 23) + index * 1.7)
    return Math.min(1, Math.max(0, 0.15 + 0.5 * beat * low + 0.35 * own * (0.4 + 0.6 * low)))
  })
}
