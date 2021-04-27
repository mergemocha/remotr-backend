import crypto from 'crypto'
import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { badRequest, internalServerError, ok } from '../../../../../utils/cannedHTTPResponses'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  logger.info(`Attempting login with username=${req.body.username} and password=${req.body.password}`)
  try {
    if (req.body.username === process.env.LOGIN_USER && req.body.password === process.env.LOGIN_PASS) {
      req.session.token = crypto.randomBytes(32).toString('hex')
      req.session.save()
      logger.info(`Login successful. Logged in with username "${req.body.username}".`)
      ok(res)
    } else {
      logger.warn(`User input invalid (Username=${req.body.username}, password=${req.body.password}). Login unsuccessful.`)
      badRequest(res)
    }
  } catch (err) {
    logger.warn(`An error occured during login: ${err.stack}`)
    internalServerError(res)
  }
}
