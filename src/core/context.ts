import type { FSWatcher } from 'chokidar'
import type { LintResult, OxlintContext, OxlintOptions, PackageManagerName } from './types'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'
import { isPackageExists } from 'local-pkg'
import { detectPackageManager } from 'nypm'
import { version } from '../../package.json'
import { createLogger } from './logger'
import { resolveOptions } from './options'
import { runLintCommand as _runLintCommand } from './oxlint'
import { setupWatcher } from './watcher'

export function createOxlint(rawOptions: Partial<OxlintOptions> = {}) {
  let watcher: FSWatcher | undefined
  const options = resolveOptions(rawOptions)
  const ctx = createInternalContext(options)

  const paths = [ctx.options.includes].flat().map(path => join(process.cwd(), ctx.options.rootDir || '.', path))

  async function runLintCommandWithContext(ids: string | string[]) {
    return ctx.runLintCommand(ids, ctx)
  }

  function setup() {
    ctx.logger.printBanner()
    if (!options.watch)
      return runLintCommandWithContext(paths)
    watcher = setupWatcher(paths, ctx)
  }

  return {
    options,
    setup,
    watcher,
    runLintCommand: runLintCommandWithContext,
    getHoldingStatus: ctx.getHoldingStatus,
    getFileHash: ctx.getFileHash,
    setFileHash: ctx.setFileHash,
    resetLintResults: ctx.resetLintResults,
    outputLintResults: ctx.outputLintResults,
  }
}

export function createInternalContext(options: OxlintOptions): OxlintContext {
  let isHolding = false
  let hasESLint: boolean | null = null
  let hasOxlint: boolean | null = null
  let packageManagerName: PackageManagerName | undefined = options.packageManager
  const logger = createLogger()
  const lintResultRecord: Record<string, LintResult[]> = {}

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

  function setFileHash(id: string, hash: string | undefined) {
    if (hash) {
      fileHashRecord[id] = hash
      return
    }

    delete fileHashRecord[id]
  }

  function insertLintResult(filename: string, result: Omit<LintResult, 'filename'>) {
    filename = relative(process.cwd(), filename)
    if (!lintResultRecord[filename])
      lintResultRecord[filename] = []
    lintResultRecord[filename].push({ ...result, filename })
  }

  function resetLintResults(filename: string) {
    filename = relative(process.cwd(), filename)
    lintResultRecord[filename] = []
  }

  function outputLintResults() {
    const isEmpty = !Object.values(lintResultRecord ?? {}).filter(results => !!results.length)?.length
    if (isEmpty)
      return

    logger.printLintResults(lintResultRecord)
  }

  async function detectDependencies() {
    if ([hasOxlint, hasESLint].includes(null)) {
      const exists = await Promise.all([
        isPackageExists('oxlint', { paths: [resolve(options.rootDir)] }),
        isPackageExists('eslint', { paths: [resolve(options.rootDir)] }),
      ])
      hasOxlint = exists[0]
      hasESLint = exists[1]
    }
  }

  function isExist(dep: 'oxlint' | 'eslint') {
    if (dep === 'oxlint')
      return hasOxlint ?? false
    if (dep === 'eslint')
      return hasESLint ?? false
    return false
  }

  async function runLintCommand(ids: string | string[], ctx: OxlintContext) {
    await detectDependencies()
    return _runLintCommand(ids, ctx)
  }

  return {
    version,
    options,
    logger,
    getPackageManager,
    runLintCommand,
    getHoldingStatus,
    setHoldingStatus,
    getFileHash,
    setFileHash,
    insertLintResult,
    resetLintResults,
    outputLintResults,
    detectDependencies,
    isExist,
  }
}
