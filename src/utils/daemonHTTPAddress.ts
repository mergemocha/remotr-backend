import { DaemonOpCode } from '../types/DaemonOps'

/**
 * Returns the REST API base URL of a daemon based on its IP address.
 *
 * @param ip - Daemon IP address
 * @returns String with daemon REST API base URL
 */
export function getBaseUrl (ip: string): string {
  const { DAEMON_API_PORT, DAEMON_API_VERSION } = process.env

  return `http://${ip}:${DAEMON_API_PORT}/api/${DAEMON_API_VERSION}/actions`
}

/**
 * Returns request URL for {@link DaemonOpCode} operations.
 *
 * @param opCode - {@link DaemonOpCode}
 * @param ip - Daemon IP address
 * @returns String with daemon operation URL
 */
export function getAddressForOp (opCode: DaemonOpCode, ip: string): string {
  return `${getBaseUrl(ip)}/${opCode}`
}
