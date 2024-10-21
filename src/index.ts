import type { LintResult, OxlintOptions } from './core/types'
import { createOxlint } from './core/context'
import { unplugin } from './core/unplugin'

export type LintOptions = Omit<OxlintOptions, 'watch'>

export async function lint(options: Partial<LintOptions> = {}) {
  const ctx = createOxlint({ ...options, watch: false })
  const results = await ctx.setup()
  return results as LintResult[]
}

export function defineConfig(options: Partial<OxlintOptions> = {}) {
  return options
}

export default unplugin
