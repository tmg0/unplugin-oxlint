import { defu } from 'defu'
import type { OxlintOptions } from './types'

export const DEFAULT_OXLINT_OPTIONS: Partial<OxlintOptions> = {
  rootDir: '.',
  deny: [],
  allow: [],
  fix: false,
  params: '',
  config: '',
  noIgnore: false,
  quiet: false,
  denyWarnings: false,
  watch: false,
  includes: '**/*.{js,ts,jsx,tsx,vue}',
  excludes: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
}

export function resolveOptions(options: Partial<OxlintOptions> = {}) {
  return defu(options, DEFAULT_OXLINT_OPTIONS) as OxlintOptions
}
