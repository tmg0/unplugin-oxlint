import { describe, expect, it } from 'vitest'
import { createInternalContext } from '../src/core/context'
import { runESLintCommand } from '../src/core/oxlint'
import { resolveOptions } from '../src/core/options'

describe('eslint', () => {
  const options = resolveOptions({ packageManager: 'npm' })
  const ctx = createInternalContext(options)

  it('no multiple empty lines', async () => {
    const outputs = await runESLintCommand(['tests/caces/no-multiple-empty-lines.ts'], ctx)
    expect(outputs.map(({ message }) => message)).toMatchInlineSnapshot(`
      [
        "Too many blank lines at the beginning of file. Max of 0 allowed.",
      ]
    `)
  })
}, 10 * 1000)
