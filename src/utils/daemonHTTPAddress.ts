import { DaemonOpCode } from '../types/DaemonOps'

export function getBaseUrl (ip: string): string {
  const { DAEMON_API_PORT, DAEMON_API_VERSION } = process.env

  return `http://${ip}:${DAEMON_API_PORT}/api/${DAEMON_API_VERSION}`
}

export function getAddressForOp (opCode: DaemonOpCode, ip: string): string {
  return `${getBaseUrl(ip)}/${opCode}`
}
