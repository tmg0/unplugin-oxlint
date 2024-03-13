import type { ESLint } from 'eslint'
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
  watch: boolean
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
  setLintResults: (filename: string, result: Omit<LintResult, 'filename'>) => void
  outputLintResults: () => void
  detectDependencies: () => Promise<void>
  isExist: (dep: 'oxlint' | 'eslint') => boolean
}

export type CreateESLintOptions = ESLint.Options

export interface OxlintOutput {
  message: string
  severity: 'warning' | 'error'
  causes: string[]
  filename: string
  related: string[]
}

export interface LintResult {
  filename: string
  severity: 'off' | 'warning' | 'error'
  message: string
  linter: 'oxlint' | 'eslint'
  ruleId: string
}
