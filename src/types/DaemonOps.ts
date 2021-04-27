import { Response } from 'express'
import { DaemonDocument } from './Daemon'
import { ExpressHandlerRequest } from './ExpressHandlerRequest'

export type DaemonOpCode = 'boot' | 'reboot' | 'shutdown' | 'restart' | 'logout'

export interface DaemonOpCtx {
  opCode: DaemonOpCode
  req: ExpressHandlerRequest
  res: Response
}

export interface DaemonOpHandlerCtx extends DaemonOpCtx {
  daemon: DaemonDocument
}
