import { createUnplugin } from 'unplugin'
import { resolveOptions } from './options'
import type { OxlintOptions } from './types'
import { createOxlint } from './context'

export const unplugin = createUnplugin<Partial<OxlintOptions> | undefined>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
  const ctx = createOxlint(options)

  return {
    name: 'oxlint',
    async buildStart() {
      await ctx.init()
    },
  }
})
