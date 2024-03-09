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
}

export type NpxCommand = 'oxlint'

export type PackageManagerName = PackageManager['name']

export interface Oxlint {
  options: OxlintOptions
  init: () => Promise<void>
}

export interface OxlintContext {
  version: string
  options: OxlintOptions
  getPackageManager: () => PackageManagerName
  setupPackageManager: () => Promise<PackageManagerName>
  runOxlintCommand: (ctx: OxlintContext) => Promise<void>
}
