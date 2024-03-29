/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { unplugin } from './core/unplugin'

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import Oxlint from 'unplugin-oxlint/rollup'
 *
 * export default {
 *   plugins: [Oxlint()],
 * }
 * ```
 */
export default unplugin.rollup
