export default interface TokenManager {
  generate: () => string
  check: (token: string) => boolean
}
