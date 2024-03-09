import process from 'node:process'
import { execa } from 'execa'
import type { OxlintOptions } from './types'

export async function runOxlintCommand(options: OxlintOptions) {
  return execa(
    'npx',
    [
      'oxlint',
      ...options.deny.map(d => ['-D', d]).flat(),
      ...options.allow.map(a => ['-A', a]).flat(),
      ...options.params.split(' '),
    ].filter(Boolean),
    {
      cwd: `${process.cwd?.()}/${options.path}`,
      stdio: 'inherit',
    },
  )
}
