import process from 'node:process'
import { join } from 'node:path'
import { execa } from 'execa'
import type { NpxCommand, OxlintContext } from './types'

const agents = {
  bun: ['bunx'],
  npm: ['npx'],
  yarn: ['yarn', 'dlx'],
  pnpm: ['pnpm', 'dlx'],
}

async function runNpxCommand(command: NpxCommand, args: string[], ctx: OxlintContext) {
  const [agent, dlx] = agents[(await ctx.getPackageManager()) ?? 'npm']

  await execa(
    agent,
    [
      dlx,
      command,
      ...args,
    ].filter(Boolean),
    {
      stdio: 'inherit',
    },
  )
}

export async function runOxlintCommand(ids: string | string[], ctx: OxlintContext) {
  const options = ctx.options

  const paths = (() => {
    if (Array.isArray(ids) ? !!ids.length : !!ids)
      return [ids]
    return [options.path]
  })().flat().map(path => join(process.cwd(), path))

  await runNpxCommand('oxlint', [
    ...options.deny.map(d => ['-D', d]).flat(),
    ...options.allow.map(a => ['-A', a]).flat(),
    ...(options.config ? ['-c', options.config] : []),
    ...options.params.split(' '),
    options.fix ? '--fix' : '',
    options.noIgnore ? '--no-ignore' : '',
    options.quiet ? '--quiet' : '',
    options.denyWarnings ? '--deny-warnings' : '',
    ...paths,
  ], ctx)
}

export async function runEslintCommand() {}
