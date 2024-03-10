import process from 'node:process'
import { detectPackageManager } from 'nypm'
import { version } from '../../package.json'
import type { OxlintContext, OxlintOptions, PackageManagerName } from './types'
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
    getHoldingStatus: ctx.getHoldingStatus,
  }
}

function createInternalContext(options: OxlintOptions): OxlintContext {
  let isHolding = true
  let packageManagerName: PackageManagerName | undefined = options.packageManager

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

  return {
    version,
    options,
    getPackageManager,
    runLintCommand,
    getHoldingStatus,
    setHoldingStatus,
  }
}
