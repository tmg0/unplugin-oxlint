# unplugin-oxlint

[![NPM version](https://img.shields.io/npm/v/unplugin-oxlint)](https://www.npmjs.com/package/unplugin-oxlint)

🌋 A universal bundler plugin for integrating the [Oxlint](https://oxc.rs/docs/guide/usage/linter.html#linter-oxlint) linter into your project.

## Features

🚀 A quick and simple way to use oxlint in your project.

🛠️ Support linting with both bundler plugin and Node.js API.

⚙️ Support common bundlers like Vite, Rollup, esbuild, and Webpack by [unplugin](https://github.com/unjs/unplugin).

🔍 Support mixed use in eslint projects by [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint).

😊 Friendly output in terminal grouped by filepath.

⚡ Only lint the files that have changed for better performance by [chokidar](https://github.com/paulmillr/chokidar).

![screenshot](./assets/screenshot.png)

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

### `Bundler Plugin`

Recommended the bundler plugin way to use the full `options` of `unplugin-oxlint`.

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

### `Node.js API`

For cases that require execution in a Node.js environment, an API method is also provided to perform linting actions.

Tips: The Node.js API supports most `options` except for `watch`.

```ts
// scripts/lint.js
import { lint } from 'unplugin-oxlint'

lint({ includes: 'src/**/*.ts', glob: true })
```

If you're looking for a way to use `lint` in `scripts`.

```json
{
  "scripts": {
    "lint": "node scripts/lint.js"
  }
}
```

And the `lint` function can alse be used for creating integrations with other projects.

```ts
type Lint = (options: Omit<Options, 'watch'>) => Promise<LintResult[]>

interface LintResult {
  filename: string
  severity: 'off' | 'warning' | 'error'
  message: string
  linter: 'oxlint' | 'eslint'
  ruleId: string
}
```

## Playground

See [playground](./playground).

## ESLint

If you are looking for a way to use oxlint in projects that still need ESLint, You can use [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint) to turn off ESLint rules that are already supported by oxlint.

The rules are extracted from [here](https://github.com/oxc-project/eslint-plugin-oxlint?tab=readme-ov-file)

`unplugin-oxlint` will automatically run the `eslint` script after `oxlint` when build start and file change.

```bash
# npm
npm i -D eslint eslint-plugin-oxlint

# pnpm
pnpm add -D eslint eslint-plugin-oxlint

# yarn
yarn add -D eslint eslint-plugin-oxlint
```

### Example

Use [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint) with [@antfu/eslint-config](https://github.com/antfu/eslint-config)

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default [
  ...await antfu(),
  oxlint.configs['flat/all'],
]
```

## Options

For all options please refer to [docs](https://github.com/52-entertainment/vite-plugin-oxlint).

This plugin accepts most options of [vite-plugin-oxlint](https://github.com/52-entertainment/vite-plugin-oxlint), and some extra options that are specific to this plugin.

### ~~`options.path`~~

- ~~Type: `string | string[]`~~
- ~~Default: `'.'`~~

### `options.includes`

- Type: `string | string[]`
- Default: `'.'`

Paths to files or dirs to be watched, for more details see: [chokidar v4](https://github.com/paulmillr/chokidar?tab=readme-ov-file#upgrading)

And for those who wants to use glob pattern, `unplugin-oxlint` also provide `glob` options.

### `options.glob`

- Type: `boolean`
- Default: `false`

Watched by glob patterns

Example:

```ts
Oxlint({
  includes: ['src/**/*.ts'],
  glob: true,
}),
```

### `options.excludes`

- Type: `RegExp[]`
- Default: `[/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]`

### `options.rootDir`

- Type: `string`
- Default: `'.'`

### `options.fix`

- Type: `boolean`
- Default: `false`

Fix as many issues as possible. Only unfixed issues are reported in the output

### `options.watch`

- Type: `boolean`
- Default: `false`

Continue to watch for changes in any of the resolved path

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

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
