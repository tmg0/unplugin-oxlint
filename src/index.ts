import { createUnplugin } from 'unplugin'
import { type OxlintOptions, resolveOptions, runOxlintCommand } from './core'

export default createUnplugin<Partial<OxlintOptions>>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)

  return {
    name: 'oxlint',
    async buildStart() {
      await runOxlintCommand(options)
    },
    async load() {
      await runOxlintCommand(options)
      return undefined
    },
  }
})
