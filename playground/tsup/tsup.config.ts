import { defineConfig } from 'tsup'
import Oxlint from 'unplugin-oxlint/esbuild'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  esbuildPlugins: [
    Oxlint({
      packageManager: 'npm',
    }),
  ],
})
