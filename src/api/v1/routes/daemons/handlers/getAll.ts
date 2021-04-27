import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { internalServerError } from '../../../../../utils/cannedHTTPResponses'
import DaemonDatabaseDriver from '../../../../../db/drivers/daemon'

const dbDriver = new DaemonDatabaseDriver()

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json(await dbDriver.getAll(true))
  } catch (err) {
    logger.error(`Encountered an error while sending all daemons: ${err.stack}`)
    internalServerError(res)
  }
}
