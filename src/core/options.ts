import { defu } from 'defu'
import type { OxlintOptions } from './types'

const DEFAULT_OXLINT_OPTIONS: Partial<OxlintOptions> = {
  path: '.',
  deny: [],
  allow: [],
  fix: false,
  params: '',
  config: '',
  noIgnore: false,
  quiet: false,
  denyWarnings: false,
  watch: false,
  includes: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/],
  excludes: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
}

export function resolveOptions(options: Partial<OxlintOptions> = {}) {
  return defu(options, DEFAULT_OXLINT_OPTIONS) as OxlintOptions
}
