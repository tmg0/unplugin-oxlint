/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { unplugin } from './core/unplugin'

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-oxlint/webpack')()],
 * }
 * ```
 */
export default unplugin.webpack
