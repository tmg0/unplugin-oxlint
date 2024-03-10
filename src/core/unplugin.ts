import { createUnplugin } from 'unplugin'
import { resolveOptions } from './options'
import type { OxlintOptions } from './types'
import { createOxlint } from './context'
import { until } from './utils'

export const unplugin = createUnplugin<Partial<OxlintOptions> | undefined>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
  const ctx = createOxlint(options)

  ctx.setup()

  return {
    name: 'oxlint',
    async buildEnd() {
      await until(ctx.getHoldingStatus, false)
    },
  }
})
