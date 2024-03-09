import process from 'node:process'
import { join } from 'node:path'
import { execa } from 'execa'
import type { OxlintOptions } from './types'

export async function runOxlintCommand(options: OxlintOptions) {
  await execa(
    'npx',
    [
      'oxlint',
      ...options.deny.map(d => ['-D', d]).flat(),
      ...options.allow.map(a => ['-A', a]).flat(),
      options.fix ? '--fix' : '',
      ...(options.config ? ['-c', options.config] : []),
      ...options.params.split(' '),
    ].filter(Boolean),
    {
      cwd: join(process.cwd(), options.path),
      stdio: 'inherit',
    },
  )
}
