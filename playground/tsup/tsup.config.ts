import { defineConfig } from 'tsup'
import Oxlint from 'unplugin-oxlint/esbuild'

export default defineConfig(({ watch }) => ({
  entry: ['./src/index.ts'],
  clean: true,
  esbuildPlugins: [
    Oxlint({
      watch: !!watch,
      includes: ['src'],
      deny: ['all'],
      packageManager: 'npm',
    }),
  ],
}))
