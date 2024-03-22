import { describe, expect, it } from 'vitest'
import { createInternalContext } from '../src/core/context'
import { runESLintCommand } from '../src/core/oxlint'
import { resolveOptions } from '../src/core/options'

describe('eslint', () => {
  const options = resolveOptions({ packageManager: 'npm' })
  const ctx = createInternalContext(options)

  it('no multiple empty lines', async () => {
    const outputs = await runESLintCommand(['tests/caces/no-multiple-empty-lines.ts'], ctx)
    expect(outputs?.map(({ messages }) => messages)).toMatchInlineSnapshot(`
      [
        [
          {
            "column": 1,
            "endColumn": 1,
            "endLine": 3,
            "fix": {
              "range": [
                0,
                2,
              ],
              "text": "",
            },
            "line": 1,
            "message": "Too many blank lines at the beginning of file. Max of 0 allowed.",
            "messageId": "blankBeginningOfFile",
            "nodeType": "Program",
            "ruleId": "style/no-multiple-empty-lines",
            "severity": 2,
          },
        ],
      ]
    `)
  })
})
