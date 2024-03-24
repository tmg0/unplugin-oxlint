import fg from 'fast-glob'
import type { OxlintOptions } from './core/types'
import { unplugin } from './core/unplugin'
import { createOxlint } from './core/context'

export type LintOptions = Omit<OxlintOptions, 'watch'>

export async function lint(options: Partial<LintOptions> = {}) {
  const ctx = createOxlint({ ...options, watch: false })
  const entries = await fg(ctx.options.includes, { dot: true })
  return ctx.runLintCommand(entries)
}

export default unplugin
