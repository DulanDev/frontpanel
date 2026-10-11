/** WCAG 2 contrast for opaque #rrggbb colours, shared by the contrast test and the token reference. */

/** The ratio each kind of pairing must reach for WCAG AA. */
export const required = { text: 4.5, ui: 3 } as const

export function isOpaqueHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value)
}

/** WCAG 2 relative luminance of an opaque #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}
