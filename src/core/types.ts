import type { PackageManager } from 'nypm'

export interface OxlintOptions {
  includes: RegExp[]
  excludes: RegExp[]
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
  setup: () => Promise<void>
}

export interface OxlintContext {
  version: string
  options: OxlintOptions
  getPackageManager: () => Promise<PackageManagerName>
  runLintCommand: (ids: string | string[], ctx: OxlintContext) => Promise<void>
  getHoldingStatus: () => boolean
  setHoldingStatus: (value: boolean) => void
  getFileHash: (id: string) => string
  setFileHash: (id: string, hash: string) => void
}

export interface CreateESLintOptions {
  fix: boolean
}
