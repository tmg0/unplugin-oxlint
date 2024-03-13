import process from 'node:process'
import { execa } from 'execa'
import { ESLint } from 'eslint'
import { defu } from 'defu'
import oxlint from 'eslint-plugin-oxlint'
import type { NpxCommand, OxlintContext } from './types'
import { createESLint, normalizeAbsolutePath } from './utils'

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

  results.forEach((result, index) => {
    if (result && Array.isArray(result.messages)) {
      const { messages } = result
      const ignoreRules = Object.keys(oxlint.configs['flat/recommended'].rules)
      results[index].messages = messages.filter(({ ruleId }) => !ignoreRules.includes(ruleId ?? ''))
    }
  })

  if (options.fix)
    await ESLint.outputFixes(results)
  if (options.quiet)
    return

  const formatter = await eslint.loadFormatter('stylish')
  const resultText = await formatter.format(results)

  process.stdout.write(resultText)
}

export async function runLintCommand(ids: string | string[], ctx: OxlintContext) {
  ctx.setHoldingStatus(true)
  await Promise.all([
    ctx.isExist('oxlint') ? runOxlintCommand(ids, ctx) : undefined,
    ctx.isExist('eslint') ? runESLintCommand(ids, ctx) : undefined,
  ].map(Boolean))
  ctx.setHoldingStatus(false)
}
