import { join } from 'node:path'
import process from 'node:process'
import { createUnplugin } from 'unplugin'
import chokidar from 'chokidar'
import { resolveOptions } from './options'
import type { OxlintOptions } from './types'
import { createOxlint } from './context'
import { generateFileHash, normalizeIgnores, until } from './utils'

export const unplugin = createUnplugin<Partial<OxlintOptions> | undefined>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
  const ctx = createOxlint(options)

  ctx.setup()

  const watcher = chokidar.watch([options.path].flat().map(path => join(process.cwd(), path)), {
    ignored: id => normalizeIgnores(options.excludes).some(regex => regex.test(id)),
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

  return {
    name: 'oxlint',
    async buildEnd() {
      await until(ctx.getHoldingStatus, false)
    },
  }
})
