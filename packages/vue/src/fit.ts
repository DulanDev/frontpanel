export type FpDeviceFit = 'none' | 'width' | 'contain'

export interface Size {
  width: number
  height: number
}

/**
 * The scale that fits a device of its design size into the room it has: to the width, or (contain)
 * to whichever side runs out first. Null until both sides it needs are measurable.
 */
export function fitScale(fit: Exclude<FpDeviceFit, 'none'>, room: Size, device: Size, maxScale: number): number | null {
  if (room.width <= 0 || device.width <= 0)
    return null
  let scale = room.width / device.width
  if (fit === 'contain') {
    if (room.height <= 0 || device.height <= 0)
      return null
    scale = Math.min(scale, room.height / device.height)
  }
  return Math.min(scale, maxScale)
}
