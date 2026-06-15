import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  // Use the `tsc` resolver for declaration files. The default `oxc` resolver
  // inlines dependency types (e.g. rollup's, which augment `estree` with a
  // `Decorator` node that `@types/estree` doesn't export), producing noisy
  // `IMPORT_IS_UNDEFINED` warnings. `tsc` keeps those types as external
  // imports, so the output is smaller and warning-free.
  dts: { resolver: 'tsc' },
})
