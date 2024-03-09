import path from 'node:path'
import { expect, it } from 'vitest'
import { build } from 'esbuild'
import Oxlint from '../src/esbuild'

it('esbuild', async () => {
  await build({
    entryPoints: [path.resolve(__dirname, 'caces/main.ts')],
    format: 'esm',
    write: false,
    bundle: true,
    platform: 'node',
    plugins: [
      Oxlint({
        path: './tests/caces',
      }),
    ],
  })
  expect(true).toBe(true)
})
