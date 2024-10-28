import type { OxlintContext } from './types'
import process from 'node:process'
import chokidar, { type FSWatcher } from 'chokidar'
import fg from 'fast-glob'
import { generateFileHash, normalizeIgnores } from './utils'

let watcher: FSWatcher

export function setupWatcher(paths: string[], ctx: OxlintContext) {
  watcher = chokidar.watch(ctx.options.glob ? fg.sync(paths) : paths, {
    ignored: id => normalizeIgnores(ctx.options.excludes).some(regex => regex.test(id)),
    persistent: true,
    ignoreInitial: true,
  })

  watcher.on('change', (id) => {
    if (ctx.getHoldingStatus())
      return
    const hash = generateFileHash(id)
    if (hash === ctx.getFileHash(id))
      return
    ctx.runLintCommand(id, ctx)
    ctx.setFileHash(id, hash)
  })

  watcher.on('add', (id) => {
    ctx.runLintCommand(id, ctx)
  })

  watcher.on('unlink', (id) => {
    ctx.setFileHash(id, undefined)
    ctx.resetLintResults(id)
    ctx.outputLintResults()
  })

  process.on('exit', () => {
    if (watcher)
      watcher.close?.()
  })

  return watcher
}
