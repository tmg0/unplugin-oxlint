import { join } from 'node:path'
import process from 'node:process'
import { expect, it } from 'vitest'
import { build } from 'esbuild'
import Oxlint from '../src/esbuild'

it('esbuild', async () => {
  const ENTRY_POINT = join(process.cwd(), 'playground/tsup/src/index.ts')

  await build({
    entryPoints: [ENTRY_POINT],
    format: 'esm',
    write: false,
    bundle: true,
    platform: 'node',
    plugins: [
      Oxlint({
        path: 'playground/tsup/src',
        packageManager: 'npm',
      }),
    ],
  })

  expect(true).toBe(true)
}, 60 * 1000)
