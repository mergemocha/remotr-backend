import { Document } from 'mongoose'

export default interface Daemon {
  token: string
  mac?: string
  ip?: string
  user?: string
  hostname?: string
}

export interface DaemonDocument extends Document {
  token: Daemon['token']
  mac?: Daemon['mac']
  ip?: Daemon['ip']
  user?: Daemon['user']
  hostname?: Daemon['hostname']
}
