import crypto from 'crypto'
import TokenManager from './TokenManager'

export default class DaemonTokenManager implements TokenManager {
  bytes = 32

  constructor (bytes?: number) {
    if (bytes) this.bytes = bytes
  }

  generate = (): string => {
    return crypto.randomBytes(this.bytes).toString('hex')
  }

  check = (token: string): boolean => {
    // TODO: Check
    return true
  }
}
