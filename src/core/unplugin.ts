import { createUnplugin } from 'unplugin'
import { resolveOptions } from './options'
import { runOxlintCommand } from './oxlint'
import type { OxlintOptions } from './types'

export const unplugin = createUnplugin<Partial<OxlintOptions>>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)

  return {
    name: 'oxlint',
    async buildEnd() {
      await runOxlintCommand(options)
    },
  }
})
