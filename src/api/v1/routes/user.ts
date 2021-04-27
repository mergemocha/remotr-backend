import crypto from 'crypto'
import { NextFunction, Response, Router } from 'express'
import { ExpressHandlerRequest } from '../../../types/ExpressHandlerRequest'
import { badRequest, internalServerError, ok, unauthorized } from '../../../utils/cannedHTTPResponses'

const router = Router()
declare module 'express-session' {
  interface SessionData {
    token: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  logger.info(`Attempting login with username=${req.body.username} and password=${req.body.password}`)
  try {
    if (req.body.username === process.env.LOGIN_USER && req.body.password === process.env.LOGIN_PASS) {
      req.session.token = crypto.randomBytes(32).toString('hex')
      req.session.save()
      logger.info(`User ${req.body.username} login successful.`)
      ok(res)
    } else {
      logger.warn(`User input invalid (Username=${req.body.username}, password=${req.body.password}). Login unsuccessful.`)
      badRequest(res)
    }
  } catch (err) {
    logger.warn(`An error occured during login: ${err.stack}`)
    internalServerError(res)
  }
})

router.post('/auth', (req, res, next) => {
  logger.info(`Received a request to authenticate session ${req.session.token}`)
  try {
    if (req.session.token) {
      logger.info(`Session authentication with token ${req.session.token} successful.`)
      ok(res)
    } else {
      logger.warn(`Session authentication unsuccessful. Invalid session token ${req.session.token}.`)
      unauthorized(res)
    }
  } catch (err) {
    logger.warn(`An error occured during session authentication ${err.stack}`)
    internalServerError(res)
  }
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/logout', async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  logger.info(`Invalidating session ${req.session.token}`)
  req.session.destroy(() => {})
  ok(res)
})

export default router
