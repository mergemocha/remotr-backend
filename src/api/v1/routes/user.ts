import crypto from 'crypto'
import { Router } from 'express'
import { internalServerError, ok, unauthorized } from '../../../utils/cannedHTTPResponses'

const router = Router()

// TODO: Auth checks

declare module 'express-session' {
  interface SessionData {
    token: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', async (req, res, next) => {
  try {
    if (req.body.username === process.env.LOGIN_USER && req.body.password === process.env.LOGIN_PASS) {
      req.session.token = crypto.randomBytes(32).toString('hex')
      req.session.save()
      logger.info('User authenticated. Login successful.')
      ok(res)
    } else {
      logger.warn('User input invalid. Login unsuccessful.')
      res.sendStatus(400)
    }
  } catch (err) {
    logger.warn('Error during login.')
    internalServerError(res)
  }
})

router.post('/auth', (req, res, next) => {
  try {
    if (req.session.token) {
      logger.info('Token authentication successful.')
      ok(res)
    } else {
      logger.warn('Token authentication unsuccessful.')
      unauthorized(res)
    }
  } catch (error) {
    logger.warn('Error during session authentication.')
    internalServerError(res)
  }
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/logout', async (req, res, next) => {
  logger.info(`Invalidating session ${req.session.token}`)
  req.session.destroy(() => {})
  ok(res)
})

export default router
