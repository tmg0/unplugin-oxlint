/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Oxlint from 'unplugin-oxlint/vite'
 *
 * export default defineConfig({
 *   plugins: [Oxlint()],
 * })
 * ```
 */
export default unplugin.vite
