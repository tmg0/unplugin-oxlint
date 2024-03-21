import process from 'node:process'
import { join } from 'node:path'
import { createUnplugin } from 'unplugin'
import chokidar, { type FSWatcher } from 'chokidar'
import type { OxlintOptions } from './types'
import { createOxlint } from './context'
import { generateFileHash, normalizeIgnores, until } from './utils'

let watcher: FSWatcher

export const unplugin = createUnplugin<Partial<OxlintOptions> | undefined>((rawOptions = {}) => {
  const ctx = createOxlint(rawOptions)

  const paths = [ctx.options.includes].flat().map(path => join(process.cwd(), ctx.options.rootDir || '.', path))

  watcher = chokidar.watch(paths, {
    ignored: id => normalizeIgnores(ctx.options.excludes).some(regex => regex.test(id)),
    persistent: true,
  })

  watcher.on('change', (id) => {
    if (ctx.getHoldingStatus())
      return
    const hash = generateFileHash(id)
    if (hash === ctx.getFileHash(id))
      return
    ctx.runLintCommand(id)
    ctx.setFileHash(id, hash)
  })

  watcher.on('add', (id) => {
    ctx.runLintCommand(id)
  })

  watcher.on('unlink', (id) => {
    ctx.setFileHash(id, undefined)
    ctx.resetLintResults(id)
    ctx.outputLintResults()
  })

  return {
    name: 'oxlint',
    async buildEnd() {
      await until(ctx.getHoldingStatus, false)
      if (!ctx.options.watch)
        await watcher.close()
    },
  }
})

process.on('exit', () => {
  if (watcher)
    watcher.close()
})
