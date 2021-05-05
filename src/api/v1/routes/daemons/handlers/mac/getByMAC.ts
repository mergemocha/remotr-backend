import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../../types/ExpressHandlerRequest'
import { internalServerError } from '../../../../../../utils/cannedHTTPResponses'
import requestWasValid from '../../../../../../utils/requestWasValid'
import * as dbDriver from '../../../../../../db/driver'
import stripDaemon from '../../../../../../utils/stripDaemon'
import Daemon from '../../../../../../types/Daemon'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!requestWasValid(req, res)) return

    // Strip extraneous and sensitive data from daemon before sending it downstream
    const daemon = await dbDriver.getByMac(req.params?.mac, true) as unknown
    res.status(200).json(stripDaemon(daemon as Daemon))
  } catch (err) {
    logger.error(`Encountered an error while sending daemon ${req.params?.mac}: ${err.stack}`)
    internalServerError(res)
  }
}
