import process from 'node:process'
import { detectPackageManager } from 'nypm'
import { version } from '../../package.json'
import type { OxlintContext, OxlintOptions, PackageManagerName } from './types'
import { runOxlintCommand } from './oxlint'

export function createOxlint(options: OxlintOptions) {
  const ctx = createInternalContext(options)

  async function init() {
    await runOxlintCommand(ctx)
  }

  ctx.setupPackageManager()

  return {
    options,
    init,
  }
}

function createInternalContext(options: OxlintOptions): OxlintContext {
  let packageManagerName: PackageManagerName = 'npm'

  async function setupPackageManager(): Promise<PackageManagerName> {
    const pkg = await detectPackageManager(process.cwd())
    packageManagerName = pkg?.name ?? 'npm'
    return packageManagerName
  }

  function getPackageManager() {
    return packageManagerName
  }

  return {
    version,
    options,
    getPackageManager,
    setupPackageManager,
    runOxlintCommand,
  }
}
