import type { CreateESLintOptions } from './types'
import { isAbsolute, join } from 'node:path'
import process from 'node:process'
import ESLintNext from 'eslint/use-at-your-own-risk'
import fse from 'fs-extra'
import { hash } from 'ohash'

export function until(value: () => any, truthyValue: any = true, ms: number = 500): Promise<void> {
  return new Promise((resolve) => {
    function c() {
      if (value() === truthyValue)
        resolve()
      else
        setTimeout(c, ms)
    }
    c()
  })
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function normalizeIgnores(excludes: string[] | RegExp[]) {
  return excludes.map((pattern) => {
    if (isString(pattern))
      return new RegExp(pattern)
    return pattern
  })
}

export function normalizeAbsolutePath(ids: string | string[], defaults: string | string[] = []) {
  return (() => {
    if (Array.isArray(ids) ? !!ids.length : !!ids)
      return [ids]
    return [defaults]
  })()
    .flat()
    .map(path => isAbsolute(path) ? path : join(process.cwd(), path))
}

export function generateFileHash(id: string) {
  const [path] = normalizeAbsolutePath(id, [])
  return hash(fse.readFileSync(path))
}

export function isDirectory(id: string) {
  const stats = fse.statSync(id)

  if (stats.isDirectory())
    return true
  return false
}

export async function createESLint(options: Partial<CreateESLintOptions> = {}) {
  const isFlat = await ESLintNext.shouldUseFlatConfig()
  if (!isFlat)
    return new ESLintNext.LegacyESLint(options)
  return new ESLintNext.FlatESLint(options)
}
