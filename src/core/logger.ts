import type { LintResult } from './types'
import { join } from 'node:path'
import process from 'node:process'
import { colors } from 'consola/utils'

const defaultLogger = {
  log(value: string) {
    return process.stdout.write(value)
  },
}

export function createLogger(logger = defaultLogger) {
  function printBanner() {
    logger.log(colors.bgCyan(colors.black(' unplugin-oxlint ')))
    logger.log('\r\n\r\n')
  }

  function printLintResults(records: Record<string, LintResult[]>) {
    logger.log('\r\n')
    Object.entries(records).forEach(([filename, results]) => {
      if (results.length) {
        logger.log(colors.underline(join(process.cwd(), filename)))
        logger.log('\r\n\r\n')
        results.forEach(({ message, severity, ruleId, line, column }) => {
          const suffix = colors.gray(`(${ruleId})`)
          let prefix = `${[line, column].join(':')}`
          const prefixPlaceholder = 7 - prefix.length
          if (prefixPlaceholder > 0)
            prefix += Array.from({ length: prefixPlaceholder }).join(' ')
          prefix = colors.gray(prefix)
          if (severity === 'error')
            logger.log(`  ${prefix}${colors.red('✘')} ${colors.red(message)} ${suffix}\n`)
          if (severity === 'warning')
            logger.log(`  ${prefix}${colors.yellow('⚠')} ${colors.yellow(message)} ${suffix}\n`)
        })
      }
    })
    logger.log('\r\n\r\n')
  }

  return {
    printBanner,
    printLintResults,
  }
}
