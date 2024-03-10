import { isAbsolute, join } from 'node:path'
import process from 'node:process'
import { hash } from 'ohash'
import fse from 'fs-extra'
import FlatESLint from 'eslint/use-at-your-own-risk'
import type { ESLint } from 'eslint'

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

export async function createEslint(overrideConfig: any) {
  return new (FlatESLint as any).FlatESLint(overrideConfig) as ESLint
  // if ((await (ESLint as any).shouldUseFlatConfig()))
  //   return new (ESLint as any).FlatESLint()
  // return (ESLint as any).LegacyESLint()
}
