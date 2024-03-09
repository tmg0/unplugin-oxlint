export interface OxlintOptions {
  path: string
  deny: string[]
  allow: string[]
  fix: boolean
  config?: string
  params: string
}
