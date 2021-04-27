import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../../types/ExpressHandlerRequest'
import { internalServerError } from '../../../../../../utils/cannedHTTPResponses'
import requestWasValid from '../../../../../../utils/requestWasValid'
import * as dbDriver from '../../../../../../db/driver'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!requestWasValid(req, res)) return
    res.status(200).json(await dbDriver.getByMac(req.params?.mac, true))
  } catch (err) {
    logger.error(`Encountered an error while sending daemon ${req.params?.mac}: ${err.stack}`)
    internalServerError(res)
  }
}
