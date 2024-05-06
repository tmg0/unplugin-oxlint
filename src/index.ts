import process from 'node:process'
import mri from 'mri'
import { loadConfig } from 'c12'
import type { OxlintOptions } from './core/types'
import { unplugin } from './core/unplugin'
import { createOxlint } from './core/context'
import { DEFAULT_OXLINT_OPTIONS } from './core/options'

export async function runMain() {
  const argv = mri(process.argv.slice(2), { boolean: ['watch'] })
  const { config } = await loadConfig({ name: 'unox', defaults: DEFAULT_OXLINT_OPTIONS })
  createOxlint({ ...config, includes: argv._ }).setup()
}

export function defineConfig(options: Partial<OxlintOptions> = {}) {
  return options
}

export default unplugin
