const { ESLint } = require('eslint')
const { FlatESLint } = require('eslint/use-at-your-own-risk')
const antfu = require('@antfu/eslint-config').default

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(overrideConfig) {
  return new FlatESLint(overrideConfig)
}

async function lintAndFix(eslint, filePaths) {
  const results = await eslint.lintFiles(filePaths)

  // Apply automatic fixes and output fixed code
  await ESLint.outputFixes(results)

  return results
}

async function outputLintingResults(eslint, results) {
  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results)
  console.log(resultText)
  return results
}

async function lintFiles(filePaths) {
  // The ESLint configuration. Alternatively, you could load the configuration
  // from a .eslintrc file or just use the default config.
  const overrideConfig = {
    ...antfu(),
  }

  const eslint = createESLintInstance(overrideConfig)
  const results = await lintAndFix(eslint, filePaths)
  return outputLintingResults(eslint, results)
}

lintFiles(['playground/tsup/src/*.ts'])
