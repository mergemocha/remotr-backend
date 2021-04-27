import { Router } from 'express'
import { internalServerError, ok } from '../../../utils/cannedHTTPResponses'

const router = Router()

// TODO: Auth checks

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', async (req, res, next) => {
  try {
    if (req.body.username === process.env.LOGIN_USER && req.body.password === process.env.LOGIN_PASS) {
      logger.info('User authenticated. Login successful.')
      ok(res)
    } else {
      logger.warn('User input invalid. Login unsuccesful.')
      res.sendStatus(400)
    }
  } catch (err) {
    logger.warn('Error during login.')
    internalServerError(res)
  }
})

router.post('/auth', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.post('/logout', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

export default router
