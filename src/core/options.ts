import { defu } from 'defu'
import type { OxlintOptions } from './types'

const DEFAULT_OXLINT_OPTIONS: OxlintOptions = {
  path: '.',
  deny: ['correctness'],
  allow: [],
  fix: false,
  params: '',
}

export function resolveOptions(options: Partial<OxlintOptions> = {}): OxlintOptions {
  return defu(options, DEFAULT_OXLINT_OPTIONS)
}
