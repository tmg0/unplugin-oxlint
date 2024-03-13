import process from 'node:process'
import { join, normalize } from 'node:path'
import { detectPackageManager } from 'nypm'
import fse from 'fs-extra'
import { version } from '../../package.json'
import type { OxlintContext, OxlintOptions, PackageManagerName } from './types'
import { runLintCommand } from './oxlint'

export function createOxlint(options: OxlintOptions) {
  const ctx = createInternalContext(options)

  async function runLintCommandWithContext(ids: string | string[]) {
    await ctx.detectDependencies()
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
  let hasESLint: boolean | null = null
  let hasOxlint: boolean | null = null
  let packageManagerName: PackageManagerName | undefined = options.packageManager

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

  async function detectDependencies() {
    if ([hasOxlint, hasESLint].includes(null)) {
      const exists = await Promise.all([
        doesDependencyExist('oxlint'),
        doesDependencyExist('eslint'),
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

  return {
    version,
    options,
    getPackageManager,
    runLintCommand,
    getHoldingStatus,
    setHoldingStatus,
    getFileHash,
    setFileHash,
    detectDependencies,
    isExist,
  }
}

async function doesDependencyExist(name: string) {
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
