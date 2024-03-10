import type { PackageManager } from 'nypm'

export interface OxlintOptions {
  path: string | string[]
  deny: string[]
  allow: string[]
  fix: boolean
  config: string
  params: string
  noIgnore: boolean
  quiet: boolean
  denyWarnings: boolean
  packageManager?: PackageManagerName | undefined
}

export type NpxCommand = 'oxlint' | 'eslint'

export type PackageManagerName = PackageManager['name']

export interface Oxlint {
  options: OxlintOptions
  init: () => Promise<void>
}

export interface OxlintContext {
  version: string
  options: OxlintOptions
  getPackageManager: () => Promise<PackageManagerName>
  runLinkCommand: (ids: string | string[], ctx: OxlintContext) => Promise<void>
}
