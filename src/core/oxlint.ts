import { execa } from 'execa'
import { ESLint } from 'eslint'
import { defu } from 'defu'
import { destr } from 'destr'
import type { LintResult, NpxCommand, OxlintContext, OxlintOutput } from './types'
import { createESLint, isString, normalizeAbsolutePath } from './utils'
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

  const paths = normalizeAbsolutePath(ids, options.rootDir)

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

  const results: LintResult[] = []
  const outputs = destr<OxlintOutput[]>(format(stdout))

  if (Array.isArray(outputs)) {
    outputs.forEach(({ filename, severity, message }) => {
      const { ruleId, content } = detectOxlintMessage(message)
      const result: LintResult = {
        filename,
        linter: 'oxlint',
        severity,
        message: content,
        ruleId,
      }
      results.push(result)
      ctx.insertLintResult(filename, result)
    })
  }

  return results
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
  const paths = normalizeAbsolutePath(ids, options.rootDir || '.')

  const eslint = await createESLint(resolveESLintOptions(ctx))
  const outputs = await eslint.lintFiles(paths)

  if (options.fix)
    await ESLint.outputFixes(outputs)
  if (options.quiet)
    return []

  const results: LintResult[] = []

  outputs.forEach(({ filePath: filename, messages }) => {
    messages.forEach(({ message, severity, ruleId }) => {
      const ESLINT_SEVERITY = ['off', 'warning', 'error']
      const result: LintResult = {
        filename,
        linter: 'eslint',
        severity: ESLINT_SEVERITY[severity] as any,
        ruleId: ruleId ?? '',
        message,
      }
      results.push(result)
      ctx.insertLintResult(filename, result)
    })
  })

  return results
}

export async function runLintCommand(ids: string | string[], ctx: OxlintContext): Promise<LintResult[]> {
  ctx.setHoldingStatus(true)

  if (isString(ids) ? !!ids : ids.length) {
    [ids].flat().forEach((filename) => {
      ctx.resetLintResults(filename)
    })
  }

  const results = await Promise.all([
    ctx.isExist('oxlint') ? runOxlintCommand(ids, ctx) : undefined,
    ctx.isExist('eslint') ? runESLintCommand(ids, ctx) : undefined,
  ].filter(Boolean))
  ctx.outputLintResults()
  ctx.setHoldingStatus(false)
  return results.flat() as LintResult[]
}
