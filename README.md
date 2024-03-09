# unplugin-oxlint

🌋 A universal bundler plugin for integrating the Oxlint linter into your project, based on [vite-plugin-oxlint](https://github.com/52-entertainment/vite-plugin-oxlint).

## Installation

```bash
# npm
npm i -D unplugin-oxlint
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Oxlint from "unplugin-oxlint/vite";

export default defineConfig({
  plugins: [Oxlint()],
});
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Oxlint from "unplugin-oxlint/rollup";

export default {
  plugins: [Oxlint()],
};
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from "esbuild";

build({
  plugins: [require("unplugin-oxlint/esbuild")()],
});
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require("unplugin-oxlint/webpack")()],
};
```

<br></details>

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
