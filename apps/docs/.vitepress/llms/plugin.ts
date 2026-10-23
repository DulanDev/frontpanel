import type { Plugin, SiteConfig } from 'vitepress'
import type { PageData } from './transform'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { base } from '../site'
import { buildLlmsFiles, loadPageData } from './build'

// What each file is served as. Markdown shows as text in a browser tab and reads as Markdown to an agent.
function contentType(name: string): string {
  return name.endsWith('.md') ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8'
}

/** Serves the Markdown files from the dev server, made fresh from the pages on each request. */
export function llmsPlugin(): Plugin {
  // Reading the components' types takes seconds, so the data is kept until a source changes.
  let data: Promise<PageData> | undefined
  const sources = ['../../../../packages/vue/src', '../../../../packages/css/src'].map(path => fileURLToPath(new URL(path, import.meta.url)))

  return {
    name: 'frontpanel-llms',
    enforce: 'pre',
    configureServer(server) {
      server.watcher.add(sources)
      server.watcher.on('change', (file) => {
        if (sources.some(source => file.startsWith(source)))
          data = undefined
      })
      server.middlewares.use(async (req, res, next) => {
        const [path = '', query] = req.url?.split('?') ?? []
        const name = decodeURIComponent(path.slice(base.length))
        // VitePress loads each page as a module from its .md path too: those requests are its own.
        const module = query !== undefined || req.headers['sec-fetch-dest'] === 'script'
        if (module || !path.startsWith(base) || !/\.md$|^llms(?:-full)?\.txt$/.test(name))
          return next()
        try {
          const file = (await buildLlmsFiles(await (data ??= loadPageData()))).get(name)
          if (file === undefined)
            return next()
          res.setHeader('Content-Type', contentType(name))
          res.end(file)
        }
        catch (error) {
          next(error)
        }
      })
    },
  }
}

/** Writes the Markdown files beside the built pages. */
export async function writeLlmsFiles(siteConfig: SiteConfig): Promise<void> {
  for (const [name, content] of await buildLlmsFiles(await loadPageData())) {
    const file = join(siteConfig.outDir, name)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, content)
  }
}
