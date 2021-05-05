import { NextFunction, Response } from 'express'
import { wake } from 'wol'
import { ExpressHandlerRequest } from '../../../../../../types/ExpressHandlerRequest'
import { ok } from '../../../../../../utils/cannedHTTPResponses'
import { performDaemonOp } from '../../utils'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => void performDaemonOp({ opCode: 'boot', req, res }, async ctx => {
  // Can't do any more checking here, this is just fire and forget
  await wake(ctx.daemon.mac)
  ok(res, 'Boot packet sent')
  logger.info(`Sent boot packet to ${req.params?.mac}.`)
})
