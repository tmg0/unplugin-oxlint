# unplugin-oxlint

🌋 A universal bundler plugin for integrating the [Oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html) linter into your project, based on [vite-plugin-oxlint](https://github.com/52-entertainment/vite-plugin-oxlint).

## Installation

```bash
# npm
npm i -D unplugin-oxlint

# pnpm
pnpm add -D unplugin-oxlint

# yar
yarn add -D unplugin-oxlint
```

## Usage

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Oxlint from 'unplugin-oxlint/vite'

export default defineConfig({
  plugins: [Oxlint()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Oxlint from 'unplugin-oxlint/rollup'

export default {
  plugins: [Oxlint()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [require('unplugin-oxlint/esbuild')()],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require('unplugin-oxlint/webpack')()],
}
```

<br></details>

## Options

For all options please refer to [docs](https://github.com/52-entertainment/vite-plugin-oxlint).

This plugin accepts all [vite-plugin-oxlint](https://github.com/52-entertainment/vite-plugin-oxlint), and some extra options that are specific to this plugin.

### `options.path`

- Type: `string | string[]`
- Default: `''`

Single file, single path or list of paths

### `options.fix`

- Type: `boolean`
- Default: `false`

Fix as many issues as possible. Only unfixed issues are reported in the output

### `options.config`

- Type: `string`
- Default: `''`

ESLint configuration file

### `options.noIgnore`

- Type: `boolean`
- Default: `false`

Disables excluding of files from .eslintignore files, `--ignore-path` flags and `--ignore-pattern` flags

### `options.quiet`

- Type: `boolean`
- Default: `false`

Disable reporting on warnings, only errors are reported

### `options.denyWarnings`

- Type: `boolean`
- Default: `false`

Ensure warnings produce a non-zero exit code

### `options.packageManager`

- Type: `'npm' | 'pnpm' | 'yarn' | 'bun'`

Declare the package manager which you want to use

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
