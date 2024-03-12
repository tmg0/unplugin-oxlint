interface FlatRecommended {
  rules: Record<string, any>
}

declare module 'eslint-plugin-oxlint' {
  const configs: { 'flat/recommended': FlatRecommended }
}
