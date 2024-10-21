import type { OxlintOptions } from './core/types'
import { createOxlint } from './core/context'
import { unplugin } from './core/unplugin'

export type LintOptions = Omit<OxlintOptions, 'watch'>

export function lint(options: Partial<LintOptions> = {}) {
  createOxlint({ ...options, watch: false }).setup()
}

export function defineConfig(options: Partial<OxlintOptions> = {}) {
  return options
}

export default unplugin
