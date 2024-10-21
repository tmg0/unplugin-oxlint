import type { LintResult, OxlintContext, OxlintOptions, PackageManagerName } from './types'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'
import chokidar, { type FSWatcher } from 'chokidar'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import fg from 'fast-glob'
import { isPackageExists } from 'local-pkg'
import { detectPackageManager } from 'nypm'
import { version } from '../../package.json'
import { resolveOptions } from './options'
import { runLintCommand as _runLintCommand } from './oxlint'
import { generateFileHash, normalizeIgnores } from './utils'

let watcher: FSWatcher

function setupWatcher(paths: string[], ctx: OxlintContext) {
  watcher = chokidar.watch(fg.sync(paths), {
    ignored: id => normalizeIgnores(ctx.options.excludes).some(regex => regex.test(id)),
    persistent: true,
  })

  watcher.on('change', (id) => {
    if (ctx.getHoldingStatus())
      return
    const hash = generateFileHash(id)
    if (hash === ctx.getFileHash(id))
      return
    ctx.runLintCommand(id, ctx)
    ctx.setFileHash(id, hash)
  })

  watcher.on('add', (id) => {
    ctx.runLintCommand(id, ctx)
  })

  watcher.on('unlink', (id) => {
    ctx.setFileHash(id, undefined)
    ctx.resetLintResults(id)
    ctx.outputLintResults()
  })
}

export function createOxlint(rawOptions: Partial<OxlintOptions> = {}) {
  const options = resolveOptions(rawOptions)
  const ctx = createInternalContext(options)

  const paths = [ctx.options.includes].flat().map(path => join(process.cwd(), ctx.options.rootDir || '.', path))

  async function runLintCommandWithContext(ids: string | string[]) {
    return ctx.runLintCommand(ids, ctx)
  }

  function setup() {
    return options.watch ? setupWatcher(paths, ctx) : runLintCommandWithContext(paths)
  }

  return {
    options,
    watcher,
    setup,
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

    process.stdout.write('\r\n')
    Object.entries(lintResultRecord).forEach(([filename, results]) => {
      if (results.length) {
        consola.warn(`[unplugin-oxlint] ${colors.blue(filename)}`)
        results.forEach(({ message, severity, linter, ruleId }) => {
          const suffix = ` (${colors.gray(linter)}: ${colors.blue(ruleId)})\n`
          if (severity === 'error')
            process.stdout.write(`       ${colors.red('✘')} ${colors.red(message)}${suffix}`)
          if (severity === 'warning')
            process.stdout.write(`       ${colors.yellow('⚠')} ${colors.yellow(message)}${suffix}`)
        })
      }
    })
    process.stdout.write('\r\n\r\n')
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

process.on('exit', () => {
  if (watcher)
    watcher.close?.()
})
