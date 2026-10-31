/*
 * Records the launch media from the docs site: the hero take as a GIF (for the README) and an MP4
 * (for posts), and the stills. It serves the built site, drives Chrome through a set take on the
 * home page's desk player and writes everything to media/ at the repo root, which git ignores:
 * commit or upload the files a README or post uses. The GIF and the link preview also go to
 * public/ (hero.gif, which the README shows, and og.png, which every page names), since the site
 * serves them; commit those when they change.
 *
 *   pnpm build
 *   pnpm --filter @frontpanel/docs record
 *   pnpm --filter @frontpanel/docs record --url http://localhost:5199/frontpanel/
 *
 * The second form records from a server already running, such as the dev server. It needs
 * Google Chrome and ffmpeg.
 */
import type { ChildProcess } from 'node:child_process'
import type { Browser, Page } from 'playwright'
import { Buffer } from 'node:buffer'
import { execFileSync, spawn } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { chromium } from 'playwright'

const docs = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(docs, '../../media')
const PORT = 4174

/** The take's window and pixel density: the GIF and MP4 are scaled down from this. */
const VIEWPORT = { width: 1280, height: 800 }
const DENSITY = 2
/** Backdrop kept round the device in the take, in CSS pixels. */
const MARGIN = 24
/** The GIF's width and frame rate, kept down so it stays under GitHub's 5 MB; the take has about ten frames a second. */
const GIF_WIDTH = 960
const GIF_FPS = 12
const GIF_LIMIT = 5 * 1024 * 1024
/** The MP4's width and frame rate. */
const MP4_WIDTH = 1200
const MP4_FPS = 30
/** How long the last frame holds, in seconds. */
const HOLD = 0.8
/**
 * The longest a take may go between frames, in seconds, and how many takes to try for one that
 * keeps to it: a stall, most often on a cold first run, would skip part of the start-up.
 */
const MAX_GAP = 0.4
const TAKES = 3

const { values: args } = parseArgs({ options: { url: { type: 'string' } } })

function say(line: string): void {
  process.stdout.write(`${line}\n`)
}

/** Serves the built docs with VitePress's preview server, once it answers. */
async function serve(): Promise<{ url: string, server: ChildProcess }> {
  const server = spawn('pnpm', ['exec', 'vitepress', 'preview', '--port', String(PORT), '--strictPort'], { cwd: docs, stdio: 'ignore' })
  const url = `http://localhost:${PORT}/frontpanel/`
  for (let tries = 0; tries < 50; tries++) {
    try {
      if ((await fetch(url)).ok)
        return { url, server }
    }
    catch {}
    await new Promise(done => setTimeout(done, 200))
  }
  server.kill()
  throw new Error(`The preview server did not answer at ${url}. Run pnpm build first.`)
}

/** A fresh page in the given skin, at full motion, with the site's appearance setting cleared. */
async function open(browser: Browser, skin: 'silver' | 'gunmetal', viewport = VIEWPORT, density = DENSITY): Promise<Page> {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: density,
    colorScheme: skin === 'gunmetal' ? 'dark' : 'light',
    reducedMotion: 'no-preference',
  })
  await context.addInitScript(() => localStorage.removeItem('vitepress-theme-appearance'))
  return context.newPage()
}

/** Waits for the hero's player to finish starting up: on, playing, at its full volume. */
async function started(page: Page): Promise<void> {
  await page.waitForFunction(() => document.querySelector('.VPHero [role="slider"]')?.getAttribute('aria-valuenow') === '83')
}

/**
 * The hero take, under ten seconds: the player starts itself up (power, the display check, play,
 * the volume knob turning up), a piano key picks an EQ preset, Next skips to a long title that
 * steps across the glass, and Skin switches Silver to Gunmetal. Frames are screenshots of the device
 * taken back to back at full density, about ten a second, which is as often as the player redraws
 * (Chrome's screencast would be faster but sends CSS-sized frames). Each keeps the moment it was
 * taken, so the take plays back at its real pace.
 */
async function recordHero(browser: Browser, url: string, frames: string): Promise<{ list: string, gap: number }> {
  const page = await open(browser, 'silver')
  await page.goto(url)
  const hero = page.locator('.VPHero .vp-raw')
  await hero.waitFor()

  const box = (await hero.boundingBox())!
  const x = Math.max(0, box.x - MARGIN)
  const y = Math.max(0, box.y - MARGIN)
  // Whole CSS pixels, so the frames come out an even number of pixels across, as the MP4 needs.
  const clip = {
    x,
    y,
    width: Math.floor(Math.min(VIEWPORT.width - x, box.width + 2 * MARGIN)),
    height: Math.floor(Math.min(VIEWPORT.height - y, box.height + 2 * MARGIN)),
    scale: DENSITY,
  }

  const shots: { file: string, at: number }[] = []
  const cdp = await page.context().newCDPSession(page)
  const take = { rolling: true }
  const camera = (async () => {
    while (take.rolling) {
      const before = performance.now()
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, clip })
      const file = join(frames, `${String(shots.length).padStart(5, '0')}.png`)
      writeFileSync(file, Buffer.from(data, 'base64'))
      shots.push({ file, at: (before + performance.now()) / 2000 })
    }
  })()

  const deck = page.locator('.VPHero .deck')
  await started(page)
  await page.waitForTimeout(300)
  await deck.getByRole('radio', { name: 'Vocal' }).click()
  await page.waitForTimeout(1300)
  for (let skip = 0; skip < 3; skip++) {
    await deck.getByRole('button', { name: 'Next track' }).click()
    await page.waitForTimeout(200)
  }
  await page.waitForTimeout(1300)
  await deck.getByRole('button', { name: 'Skin' }).click()
  await page.waitForTimeout(1600)

  take.rolling = false
  await camera
  await page.context().close()

  // ffmpeg's concat list: each frame held until the next was taken, the last for HOLD.
  const lines = shots.flatMap((shot, index) => {
    const next = shots[index + 1]
    const duration = next ? next.at - shot.at : HOLD
    return [`file '${shot.file}'`, `duration ${duration.toFixed(4)}`]
  })
  lines.push(`file '${shots.at(-1)!.file}'`)
  const list = join(frames, 'list.txt')
  writeFileSync(list, `${lines.join('\n')}\n`)
  const seconds = shots.at(-1)!.at - shots[0]!.at + HOLD
  const gaps = shots.slice(1).map((shot, index) => [shot.at - shots[index]!.at, shots[index]!.at - shots[0]!.at])
  const [gap, at] = gaps.reduce((worst, next) => next[0]! > worst[0]! ? next : worst)
  say(`  ${shots.length} frames over ${seconds.toFixed(1)} s, ${clip.width * DENSITY} px wide; longest gap ${(gap! * 1000).toFixed(0)} ms at ${at!.toFixed(1)} s`)
  return { list, gap: gap! }
}

function encode(list: string): void {
  const input = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list]
  const mp4 = join(out, 'hero.mp4')
  execFileSync('ffmpeg', [...input, '-vf', `fps=${MP4_FPS},scale=${MP4_WIDTH}:-2:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', mp4])
  // One palette for the whole take, weighted to what moves, and ordered dither in the changed
  // areas only, so still parts of the frame do not crawl.
  const gif = join(out, 'hero.gif')
  const palette = `fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`
  execFileSync('ffmpeg', [...input, '-filter_complex', palette, gif])
  for (const file of [gif, mp4])
    say(`  ${file}: ${(statSync(file).size / 1024 / 1024).toFixed(2)} MB`)
  if (statSync(gif).size > GIF_LIMIT)
    say(`  The GIF is over GitHub's 5 MB: lower GIF_WIDTH or GIF_FPS.`)
  copyFileSync(gif, join(docs, 'public/hero.gif'))
}

/**
 * The stills: the home page and the components page in both skins, the controls close up, the
 * device row, and the link preview, which also goes to public/og.png.
 */
async function stills(browser: Browser, url: string): Promise<void> {
  const page1600 = { width: 1600, height: 1000 }
  for (const skin of ['silver', 'gunmetal'] as const) {
    const page = await open(browser, skin, page1600)
    await page.goto(url)
    await started(page)
    await page.waitForTimeout(600)
    await page.screenshot({ path: join(out, `home-${skin}.png`) })

    const row = page.locator('.home-devices')
    await row.scrollIntoViewIfNeeded()
    await row.screenshot({ path: join(out, `devices-${skin}.png`) })

    await page.goto(new URL('reference/components', url).href)
    await page.waitForTimeout(600)
    await page.screenshot({ path: join(out, `components-${skin}.png`) })
    await page.context().close()
  }

  // The gel Play, the transport and the EQ keys, close up.
  const close = await open(browser, 'silver', VIEWPORT, 3)
  await close.goto(url)
  await started(close)
  const parts = await Promise.all(['.VPHero .transport', '.VPHero .presets'].map(async selector => (await close.locator(selector).boundingBox())!))
  const x = Math.min(...parts.map(part => part.x)) - 12
  const y = Math.min(...parts.map(part => part.y)) - 12
  const right = Math.max(...parts.map(part => part.x + part.width)) + 12
  const bottom = Math.max(...parts.map(part => part.y + part.height)) + 12
  await close.screenshot({ path: join(out, 'controls-closeup.png'), clip: { x, y, width: right - x, height: bottom - y } })
  await close.context().close()

  // The link preview, from its own page laid out at the size the sites ask for. It is the site's
  // own file, so it goes in public/ as well, for the og:image tag. The player at the back skips a
  // track, so the two show different titles.
  const og = await open(browser, 'silver', { width: 1200, height: 630 }, 1)
  await og.goto(new URL('og', url).href)
  await og.waitForFunction(() => [...document.querySelectorAll('.og [role="slider"]')].every(knob => knob.getAttribute('aria-valuenow') === '83'))
  await og.locator('.og .back').getByRole('button', { name: 'Next track' }).click()
  await og.mouse.move(0, 0)
  await og.waitForTimeout(1200)
  for (const path of [join(out, 'og.png'), join(docs, 'public/og.png')])
    await og.screenshot({ path })
  await og.context().close()
}

const served = args.url ? undefined : await serve()
const url = args.url ?? served!.url
const frames = mkdtempSync(join(tmpdir(), 'frontpanel-take-'))
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
try {
  say(`Recording from ${url}`)
  say('Hero take')
  for (let attempt = 1; ; attempt++) {
    const take = await recordHero(browser, url, frames)
    if (take.gap <= MAX_GAP || attempt === TAKES) {
      if (take.gap > MAX_GAP)
        say(`  Every take stalled; this one may skip part of the start-up.`)
      encode(take.list)
      break
    }
    say('  The take stalled; taking it again.')
    rmSync(frames, { recursive: true, force: true })
    mkdirSync(frames)
  }
  say('Stills')
  await stills(browser, url)
  say(`Done: ${out}`)
}
finally {
  await browser.close()
  served?.server.kill()
  rmSync(frames, { recursive: true, force: true })
}
