import { join } from 'node:path'
import process from 'node:process'
import { createUnplugin } from 'unplugin'
import chokidar from 'chokidar'
import type { OxlintOptions } from './types'
import { createOxlint } from './context'
import { generateFileHash, normalizeIgnores, until } from './utils'

export const unplugin = createUnplugin<Partial<OxlintOptions> | undefined>((rawOptions = {}) => {
  const ctx = createOxlint(rawOptions)

  ctx.setup()

  if (ctx.options.watch) {
    const watcher = chokidar.watch([ctx.options.path].flat().map(path => join(process.cwd(), path)), {
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
  }

  return {
    name: 'oxlint',
    async buildEnd() {
      await until(ctx.getHoldingStatus, false)
    },
  }
})
