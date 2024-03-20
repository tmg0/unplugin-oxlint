import { defineConfig } from 'tsup'
import Oxlint from '../../src/esbuild'

export default defineConfig(({ watch }) => ({
  entry: ['src/index.ts'],
  clean: true,
  esbuildPlugins: [
    Oxlint({
      watch: !!watch,
      includes: ['src/**/*.ts'],
      deny: ['all'],
      packageManager: 'npm',
    }),
  ],
}))
