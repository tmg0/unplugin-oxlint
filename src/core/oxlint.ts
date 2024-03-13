import process from 'node:process'
import { join, normalize } from 'node:path'
import { execa } from 'execa'
import fse from 'fs-extra'
import { ESLint } from 'eslint'
import { defu } from 'defu'
import { destr } from 'destr'
import type { NpxCommand, OxlintContext, OxlintOutput } from './types'
import { createESLint, normalizeAbsolutePath } from './utils'
import { oxlintRE } from './regexp'

const agents = {
  bun: ['bunx'],
  npm: ['npx'],
  yarn: ['yarn', 'dlx'],
  pnpm: ['pnpm', 'dlx'],
}

async function runNpxCommand(command: NpxCommand, args: string[], ctx: OxlintContext) {
  const [agent, dlx] = agents[(await ctx.getPackageManager()) ?? 'npm']

  return execa(
    agent,
    [
      dlx,
      command,
      ...args,
    ].filter(Boolean),
    {
      reject: false,
    },
  )
}

function detectOxlintMessage(message: string) {
  let ruleId = ''
  let content = message
  let plugin = ''

  const match = oxlintRE.exec(message)

  if (match) {
    plugin = match[1]
    ruleId = match[2]
    content = match[3]
  }

  oxlintRE.lastIndex = 0

  return {
    ruleId,
    content,
    plugin,
  }
}

export async function runOxlintCommand(ids: string | string[], ctx: OxlintContext) {
  const options = ctx.options

  const paths = normalizeAbsolutePath(ids, options.path)

  const { stdout } = await runNpxCommand('oxlint', [
    ...options.deny.map(d => ['-D', d]).flat(),
    ...options.allow.map(a => ['-A', a]).flat(),
    ...(options.config ? ['-c', options.config] : []),
    ...options.params.split(' '),
    options.fix ? '--fix' : '',
    options.noIgnore ? '--no-ignore' : '',
    options.quiet ? '--quiet' : '',
    options.denyWarnings ? '--deny-warnings' : '',
    '--format',
    ...paths,
  ], ctx)

  function format(value: string) {
    const index = value.indexOf('Finished')
    return value.slice(0, index).trim()
  }

  const outputs = destr<OxlintOutput[]>(format(stdout))

  if (Array.isArray(outputs)) {
    outputs.forEach(({ filename, severity, message }) => {
      const { ruleId, content } = detectOxlintMessage(message)
      ctx.setLintResults(filename, {
        linter: 'oxlint',
        severity,
        message: content,
        ruleId,
      })
    })
  }
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

function resolveESLintOptions({ options }: OxlintContext): ESLint.Options {
  return defu({}, {
    fix: options.fix,
    overrideConfigFile: options.config || undefined,
    ignore: !options.noIgnore,
  })
}

export async function runESLintCommand(ids: string | string[], ctx: OxlintContext) {
  const options = ctx.options
  const paths = normalizeAbsolutePath(ids, options.path || ['.'])

  const eslint = await createESLint(resolveESLintOptions(ctx))
  const results = await eslint.lintFiles(paths)

  if (options.fix)
    await ESLint.outputFixes(results)
  if (options.quiet)
    return

  results.forEach(({ filePath: filename, messages }) => {
    messages.forEach(({ message, severity, ruleId }) => {
      const ESLINT_SEVERITY = ['off', 'warning', 'error']
      ctx.setLintResults(filename, {
        linter: 'eslint',
        severity: ESLINT_SEVERITY[severity] as any,
        ruleId: ruleId ?? '',
        message,
      })
    })
  })
}

export async function runLintCommand(ids: string | string[], ctx: OxlintContext) {
  ctx.setHoldingStatus(true)
  const hasESLint = await doesDependencyExist('eslint')
  const tasks = [runOxlintCommand(ids, ctx), hasESLint ? runESLintCommand(ids, ctx) : undefined].filter(Boolean)
  await Promise.all(tasks)
  ctx.outputLintResults()
  ctx.setHoldingStatus(false)
}
