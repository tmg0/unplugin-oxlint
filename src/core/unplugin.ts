import type { OxlintOptions } from './types'

import { createUnplugin } from 'unplugin'
import { createOxlint } from './context'
import { until } from './utils'

export const unplugin = createUnplugin<Partial<OxlintOptions> | undefined>((rawOptions = {}) => {
  const ctx = createOxlint(rawOptions)
  ctx.setup()

  return {
    name: 'oxlint',

    async buildEnd() {
      await until(ctx.getHoldingStatus, false)
      if (!ctx.options.watch)
        await ctx.watcher?.close()
    },
  }
})
