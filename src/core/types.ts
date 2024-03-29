import type { ESLint } from 'eslint'
import type { PackageManager } from 'nypm'

export interface OxlintOptions {
  rootDir: string
  includes: string | string[]
  excludes: RegExp[]
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
  runLintCommand: (ids: string | string[], ctx: OxlintContext) => Promise<LintResult[]>
  getHoldingStatus: () => boolean
  setHoldingStatus: (value: boolean) => void
  getFileHash: (id: string) => string
  setFileHash: (id: string, hash: string | undefined) => void
  insertLintResult: (filename: string, result: Omit<LintResult, 'filename'>) => void
  resetLintResults: (filename: string) => void
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
