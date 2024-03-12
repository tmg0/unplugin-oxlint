# unplugin-oxlint

[![NPM version](https://img.shields.io/npm/v/unplugin-oxlint)](https://www.npmjs.com/package/unplugin-oxlint)

🌋 A universal bundler plugin for integrating the [Oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html) linter into your project, based on [vite-plugin-oxlint](https://github.com/52-entertainment/vite-plugin-oxlint).

## Features

⚙️ Support common bundlers like Vite, Rollup, esbuild, and Webpack, powered by [unplugin](https://github.com/unjs/unplugin)

🔍 Support using ESLint with oxlint; automatically run lint actions after oxlint.

🛠️ Run the lint check before bundling and after the file changes using [chokidar](https://github.com/paulmillr/chokidar).

⚡ Only lint the files that have changed for better performance.

🚀 The transformation process will only be blocked during the initial compilation.

## Installation

```bash
# npm
npm i -D oxlint unplugin-oxlint

# pnpm
pnpm add -D oxlint unplugin-oxlint

# yar
yarn add -D oxlint unplugin-oxlint
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

### `options.watch`

- Type: `boolean`
- Default: `false`

Continue to watch for changes in any of the resolved path

### `options.includes`

- Type: `string[] | RegExp[]`
- Default: `[/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]`

### `options.excludes`

- Type: `string[] | RegExp[]`
- Default: `[/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]`

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

Normally you don't need to modify this option. `unplugin-oxlint` will automatically detect `package.json` and lock file by [nypm](https://github.com/unjs/nypm)

## Eslint

If you are looking for a way to use oxlint in projects that still need ESLint, You can use [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint) to turn off ESLint rules that are already supported by oxlint.

The rules are extracted from [here](https://github.com/oxc-project/eslint-plugin-oxlint?tab=readme-ov-file)

`unplugin-oxlint` will automatically run the `eslint` script after `oxlint` when build start and file change.

```bash
# npm
npm i -D eslint eslint-plugin-oxlint

# pnpm
pnpm add -D eslint eslint-plugin-oxlint

# yar
yarn add -D eslint eslint-plugin-oxlint
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
