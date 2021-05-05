import { NextFunction, Response } from 'express'
import { wake } from 'wake_on_lan'
import { ExpressHandlerRequest } from '../../../../../../types/ExpressHandlerRequest'
import { ok } from '../../../../../../utils/cannedHTTPResponses'
import { performDaemonOp } from '../../utils'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => void performDaemonOp({ opCode: 'boot', req, res }, async ctx => {
  // Figure out the broadcast address
  const ipParts = ctx.daemon.ip?.split('.')

  if (ipParts) {
    // Remove the last part and replace it with 255 (broadcast address)
    ipParts.splice(3, 1)
    ipParts.push('255')
  }

  // Can't do any more checking here, this is just fire and forget
  wake(ctx.daemon.mac.toUpperCase(), { address: ipParts?.join('.'), port: 9 })
  ok(res, 'Boot packet sent')
  logger.info(`Sent boot packet to ${req.params?.mac}.`)
})
