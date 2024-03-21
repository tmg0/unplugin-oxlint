import { describe, expect, it } from 'vitest'
import { createInternalContext } from '../src/core/context'
import { runOxlintCommand } from '../src/core/oxlint'
import { resolveOptions } from '../src/core/options'

describe('oxlint', () => {
  const options = resolveOptions({ packageManager: 'npm' })
  const ctx = createInternalContext(options)

  it('no empty file', async () => {
    const outputs = await runOxlintCommand(['tests/caces/no-empty-file.ts'], ctx)
    expect(outputs).toMatchInlineSnapshot(`
      [
        {
          "causes": [],
          "filename": "tests/caces/no-empty-file.ts",
          "help": "Delete this file or add some code to it.",
          "labels": [
            {
              "span": {
                "length": 0,
                "offset": 0,
              },
            },
          ],
          "message": "eslint-plugin-unicorn(no-empty-file): Empty files are not allowed.",
          "related": [],
          "severity": "warning",
        },
      ]
    `)
  })

  it('no debugger', async () => {
    const outputs = await runOxlintCommand(['tests/caces/no-debugger.ts'], ctx)
    expect(outputs).toMatchInlineSnapshot(`
      [
        {
          "causes": [],
          "filename": "tests/caces/no-debugger.ts",
          "labels": [
            {
              "span": {
                "length": 8,
                "offset": 0,
              },
            },
          ],
          "message": "eslint(no-debugger): \`debugger\` statement is not allowed",
          "related": [],
          "severity": "warning",
        },
      ]
    `)
  })
})
