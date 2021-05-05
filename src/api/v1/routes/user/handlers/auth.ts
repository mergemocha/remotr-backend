import util from 'util'
import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { unauthorized, internalServerError, ok } from '../../../../../utils/cannedHTTPResponses'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  logger.info(`Received a request to authenticate session with token ${req.session.token}`)
  try {
    if (req.session.token) {
      logger.info(`Session authentication with token ${req.session.token} successful.`)
      ok(res)
    } else {
      logger.warn(`Session authentication unsuccessful. Invalid session token ${req.session.token} in session ${util.inspect(req.session)}.`)
      unauthorized(res)
    }
  } catch (err) {
    logger.warn(`An error occured during session authentication ${err.stack}`)
    internalServerError(res)
  }
}
