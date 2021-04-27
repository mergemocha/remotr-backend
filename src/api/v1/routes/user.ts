import { Router } from 'express'
import session from 'express-session'
import { internalServerError, ok } from '../../../utils/cannedHTTPResponses'
import { getSessionToken } from './session'

const router = Router()

// TODO: Auth checks

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', async (req, res, next) => {
  try {
    if (req.body.username === process.env.LOGIN_USER && req.body.password === process.env.LOGIN_PASS) {
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
  console.log(req.headers['x-connect.sid'])

  try {
    if (req.query.sessionId) {
      logger.info('Token authentication successful.')
      ok(res)
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    logger.warn('Error during session authentication.')
    internalServerError(res)
  }
})

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {})

  res.sendStatus(200)
})

export default router
