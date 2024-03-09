import { join } from 'node:path'
import process from 'node:process'
import { expect, it } from 'vitest'
import { build } from 'esbuild'
import Oxlint from '../src/esbuild'

it('esbuild', async () => {
  await build({
    entryPoints: [join(process.cwd(), 'playground/tsup/src/index.ts')],
    format: 'esm',
    write: false,
    bundle: true,
    platform: 'node',
    plugins: [
      Oxlint({
        path: 'playground/tsup',
      }),
    ],
  })
  expect(true).toBe(true)
})
