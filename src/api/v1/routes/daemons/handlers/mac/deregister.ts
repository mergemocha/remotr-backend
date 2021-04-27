import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../../types/ExpressHandlerRequest'
import { internalServerError, notFound, ok, unauthorized } from '../../../../../../utils/cannedHTTPResponses'
import * as dbDriver from '../../../../../../db/driver'
import requestWasValid from '../../../../../../utils/requestWasValid'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!requestWasValid(req, res)) return

    logger.info(`Received daemon de-registration request from IP ${req.ip}: daemon=${req.params?.mac}, token=${req.headers.authorization}.`)

    const daemon = await dbDriver.getByMac(req.params?.mac)

    if (daemon === null) {
      logger.warn(`Received daemon de-registration request from IP ${req.ip} for non-existent daemon ${req.params?.mac}.`)
      notFound(res, 'No daemon with this MAC address found')
    } else if (daemon.token !== req.headers.authorization) {
      logger.warn(`Received daemon de-registration request from IP ${req.ip} for daemon ${req.params?.mac}, but token was incorrect (Expected ${daemon.token}, got ${req.headers.authorization}).`)
      return unauthorized(res, 'Invalid token')
    } else {
      await dbDriver.remove(daemon)
      ok(res, 'De-registration successful')
      logger.info(`Daemon de-registration for daemon ${req.params?.mac} complete.`)
    }
  } catch (err) {
    logger.error(`Encountered an error while performing de-registration operation for daemon ${req.params?.mac}: ${err.stack}`)
    internalServerError(res)
  }
}
