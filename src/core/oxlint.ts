import process from 'node:process'
import { join, normalize } from 'node:path'
import { execa } from 'execa'
import fse from 'fs-extra'
import type { NpxCommand, OxlintContext } from './types'
import { normalizeAbsolutePath } from './utils'

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
      reject: false,
    },
  )
}

export async function runOxlintCommand(ids: string | string[], ctx: OxlintContext) {
  const options = ctx.options

  const paths = normalizeAbsolutePath(ids, options.path)

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

export async function doesDependencyExist(name: string) {
  const segments = normalize(process.cwd()).split('/')
  const path = join(segments.join('/') || '/', 'package.json')
  if (fse.pathExistsSync(path)) {
    const packageJSON = (await fse.readJSON(path))
    if (Object.keys(packageJSON.dependencies ?? {}).includes(name))
      return true
    if (Object.keys(packageJSON.devDependencies ?? {}).includes(name))
      return true
  }
  return false
}

export async function runEslintCommand(ids: string | string[], ctx: OxlintContext) {
  const options = ctx.options
  const paths = normalizeAbsolutePath(ids, options.path || ['.'])

  await runNpxCommand('eslint', [
    options.fix ? '--fix' : '',
    options.noIgnore ? '--no-ignore' : '',
    options.quiet ? '--quiet' : '',
    ...paths,
  ], ctx)
}

export async function runLintCommand(ids: string | string[], ctx: OxlintContext) {
  ctx.setHoldingStatus(true)
  const hasEslint = await doesDependencyExist('eslint')
  await Promise.all([
    runOxlintCommand(ids, ctx),
    hasEslint ? runEslintCommand(ids, ctx) : undefined
  ].map(Boolean)) 
  ctx.setHoldingStatus(false)
}
