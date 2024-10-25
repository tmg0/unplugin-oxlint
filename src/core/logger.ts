import type { LintResult } from './types'
import { join } from 'node:path'
import process from 'node:process'
import { colors } from 'consola/utils'
import { version } from '../../package.json'

const defaultLogger = {
  log(value: string) {
    return process.stdout.write(value)
  },
}

export function createLogger(logger = defaultLogger) {
  function printLintResults(records: Record<string, LintResult[]>) {
    logger.log('\r\n')
    logger.log(colors.bgCyan(colors.black(` v${version} `)))
    logger.log(' unplugin-oxlint ')
    logger.log('\r\n')
    Object.entries(records).forEach(([filename, results]) => {
      if (results.length) {
        logger.log('\r\n')
        logger.log(colors.blue(colors.underline(join(process.cwd(), filename))))
        logger.log('\r\n\r\n')
        results.forEach(({ message, severity, ruleId, line, column }) => {
          const suffix = colors.gray(`(${ruleId})`)
          let prefix = `${[line, column].join(':')}`
          const prefixPlaceholder = 7 - prefix.length
          if (prefixPlaceholder > 0)
            prefix += Array.from({ length: prefixPlaceholder }).join(' ')
          prefix = colors.gray(prefix)
          if (severity === 'error')
            logger.log(`  ${prefix}${colors.red('✘')} ${colors.red(message)} ${suffix}\r\n`)
          if (severity === 'warning')
            logger.log(`  ${prefix}${colors.yellow('⚠')} ${colors.yellow(message)} ${suffix}\r\n`)
        })
      }
    })
    logger.log('\r\n')
  }

  return {
    printLintResults,
  }
}
