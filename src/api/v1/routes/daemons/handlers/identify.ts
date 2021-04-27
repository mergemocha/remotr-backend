import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { ok, unauthorized, internalServerError } from '../../../../../utils/cannedHTTPResponses'
import requestWasValid from '../../../../../utils/requestWasValid'
import * as dbDriver from '../../../../../db/driver'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!requestWasValid(req, res)) return

    logger.info(`Received daemon identification request from IP ${req.ip}: token=${req.headers.authorization}, MAC=${req.body.mac}, IP=${req.body.ip}, user=${req.body.user}, hostname=${req.body.hostname}`)

    const daemon = await dbDriver.getByToken(req.headers.authorization)

    if (daemon !== null) {
      const { mac, ip, user, hostname }: { mac: string, ip: string, user: string, hostname: string } = req.body

      daemon.mac = mac
      daemon.ip = ip
      daemon.user = user
      daemon.hostname = hostname

      await daemon.save()

      ok(res)
      logger.info(`Daemon identification for daemon ${req.body.mac} complete.`)
    } else {
      logger.warn(`Received daemon identification request from IP ${req.ip}, but token was incorrect (token=${req.headers.authorization}).`)
      unauthorized(res, 'Invalid token')
    }
  } catch (err) {
    logger.error(`Encountered an error during daemon identification: ${err.stack}`)
    internalServerError(res)
  }
}
