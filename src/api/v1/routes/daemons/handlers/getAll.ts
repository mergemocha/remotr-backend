import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { internalServerError } from '../../../../../utils/cannedHTTPResponses'
import * as dbDriver from '../../../../../db/driver'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json(await dbDriver.getAll(true))
  } catch (err) {
    logger.error(`Encountered an error while sending all daemons: ${err.stack}`)
    internalServerError(res)
  }
}
