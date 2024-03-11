declare module 'eslint/use-at-your-own-risk' {
  export const FlatESLint: any
  export const LegacyESLint: any
  export const shouldUseFlatConfig: () => Promise<boolean>
}
