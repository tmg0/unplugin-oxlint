import { describe, expect, it } from 'vitest'
import { createInternalContext } from '../src/core/context'
import { runOxlintCommand } from '../src/core/oxlint'
import { resolveOptions } from '../src/core/options'

describe('oxlint', () => {
  const options = resolveOptions({ packageManager: 'npm' })
  const ctx = createInternalContext(options)

  it('no empty file', async () => {
    const outputs = await runOxlintCommand(['tests/caces/no-empty-file.ts'], ctx)
    expect(outputs?.map(({ message }) => message)).toMatchInlineSnapshot(`
      [
        "eslint-plugin-unicorn(no-empty-file): Empty files are not allowed.",
      ]
    `)
  })

  it('no debugger', async () => {
    const outputs = await runOxlintCommand(['tests/caces/no-debugger.ts'], ctx)
    expect(outputs?.map(({ message }) => message)).toMatchInlineSnapshot(`
      [
        "eslint(no-debugger): \`debugger\` statement is not allowed",
      ]
    `)
  })
})
