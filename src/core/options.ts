import { defu } from 'defu'
import type { OxlintOptions } from './types'

const DEFAULT_OXLINT_OPTIONS: Partial<OxlintOptions> = {
  path: '.',
  deny: ['correctness'],
  allow: [],
  fix: false,
  params: '',
  config: '',
  noIgnore: false,
  quiet: false,
  denyWarnings: false,
}

export function resolveOptions(options: Partial<OxlintOptions> = {}) {
  return defu(options, DEFAULT_OXLINT_OPTIONS) as OxlintOptions
}
