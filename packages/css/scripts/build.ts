/*
 * Writes tokens.css, components.css and tailwind.css from src/ (see generate.ts). Run with
 * `pnpm build`; `--watch` rebuilds on every change to src/ and keeps going after an error.
 */
import type { Sources, Tokens } from './generate.ts'
import { watch } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { generate, GenerateError } from './generate.ts'

const root = new URL('../', import.meta.url)
const src = new URL('src/', root)

async function readSources(): Promise<Sources> {
  // A query string defeats the module cache, so --watch sees an edited tokens.ts.
  const { tokens } = await import(`${new URL('tokens.ts', src).href}?t=${Date.now()}`) as { tokens: Tokens }
  return {
    utilities: await readFile(new URL('utilities.css', src), 'utf8'),
    shared: await readFile(new URL('shared.css', src), 'utf8'),
    tokens,
  }
}

async function build(): Promise<void> {
  const outputs = generate(await readSources())
  for (const [file, css] of Object.entries(outputs))
    await writeFile(new URL(file, root), css)
  console.log(`wrote ${Object.keys(outputs).join(', ')}`)
}

if (process.argv.includes('--watch')) {
  const rebuild = () => build().catch((error: unknown) => {
    console.error(error instanceof GenerateError ? `error: ${error.message}` : error)
  })
  await rebuild()
  watch(src, { recursive: true }, rebuild)
}
else {
  await build()
}
