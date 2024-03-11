import type { ESLint } from 'eslint'

declare module 'eslint/use-at-your-own-risk' {
  export const FlatESLint: typeof ESLint
  export const LegacyESLint: typeof ESLint
  export const shouldUseFlatConfig: () => Promise<boolean>
}
