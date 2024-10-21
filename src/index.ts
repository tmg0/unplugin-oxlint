import type { OxlintOptions } from './core/types'
import { unplugin } from './core/unplugin'

export function defineConfig(options: Partial<OxlintOptions> = {}) {
  return options
}

export default unplugin
