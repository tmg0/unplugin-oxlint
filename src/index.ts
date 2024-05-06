import process from 'node:process'
import mri from 'mri'
import type { OxlintOptions } from './core/types'
import { unplugin } from './core/unplugin'
import { createOxlint } from './core/context'

export type LintOptions = Omit<OxlintOptions, 'watch'>

export async function runMain() {
  const argv = mri(process.argv.slice(2), { boolean: ['watch'] })
  createOxlint({ ...argv, includes: argv._ }).setup()
}

export default unplugin
