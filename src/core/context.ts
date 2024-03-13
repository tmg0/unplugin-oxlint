import process from 'node:process'
import { relative } from 'node:path'
import { detectPackageManager } from 'nypm'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import { version } from '../../package.json'
import type { LintResult, OxlintContext, OxlintOptions, PackageManagerName } from './types'
import { runLintCommand } from './oxlint'

export function createOxlint(options: OxlintOptions) {
  const ctx = createInternalContext(options)

  function runLintCommandWithContext(ids: string | string[]) {
    return ctx.runLintCommand(ids, ctx)
  }

  async function setup() {
    await runLintCommandWithContext([])
  }

  return {
    options,
    setup,
    runLintCommand: runLintCommandWithContext,
    getHoldingStatus: ctx.getHoldingStatus,
    getFileHash: ctx.getFileHash,
    setFileHash: ctx.setFileHash,
  }
}

function createInternalContext(options: OxlintOptions): OxlintContext {
  let isHolding = true
  let packageManagerName: PackageManagerName | undefined = options.packageManager
  let lintResultRecord: Record<string, LintResult[]> = {}

  const fileHashRecord: Record<string, string> = {}

  async function getPackageManager() {
    if (!packageManagerName) {
      const pkg = await detectPackageManager(process.cwd())
      packageManagerName = pkg?.name ?? 'npm'
    }
    return packageManagerName
  }

  function getHoldingStatus() {
    return isHolding
  }

  function setHoldingStatus(value: boolean) {
    isHolding = value
  }

  function getFileHash(id: string) {
    return fileHashRecord[id]
  }

  function setFileHash(id: string, hash: string) {
    fileHashRecord[id] = hash
  }

  function setLintResults(filename: string, result: Omit<LintResult, 'filename'>) {
    filename = relative(process.cwd(), filename)
    if (!lintResultRecord[filename])
      lintResultRecord[filename] = []
    lintResultRecord[filename].push({ ...result, filename })
  }

  function outputLintResults() {
    if (!Object.keys(lintResultRecord ?? {})?.length)
      return

    process.stdout.write('\r\n')
    Object.entries(lintResultRecord).forEach(([filename, results]) => {
      consola.warn(`[unplugin-oxlint] ${colors.blue(filename)}`)
      results.forEach(({ message, severity, linter, ruleId }) => {
        const tag = linter === 'oxlint' ? [linter, 'eslint'].join('-') : linter
        const suffix = ` (${colors.gray(tag)}: ${colors.blue(ruleId)})\n`
        if (severity === 'error')
          process.stdout.write(`       ${colors.red('✘')} ${colors.red(message)}${suffix}`)
        if (severity === 'warning')
          process.stdout.write(`       ${colors.yellow('⚠')} ${colors.yellow(message)}${suffix}`)
      })
    })
    process.stdout.write('\r\n\r\n')

    lintResultRecord = {}
  }

  return {
    version,
    options,
    getPackageManager,
    runLintCommand,
    getHoldingStatus,
    setHoldingStatus,
    getFileHash,
    setFileHash,
    setLintResults,
    outputLintResults,
  }
}
