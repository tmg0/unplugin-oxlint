import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  format: ['cjs', 'esm'],
  target: 'node18',
  splitting: true,
  cjsInterop: true,
  clean: true,
  dts: true,
})
