import { Router } from 'express'
import DaemonTokenManager from '../../../auth/DaemonTokenManager'
import DaemonDatabaseDriver from '../../../db/drivers/daemon'

const router = Router()

const tokenManager = new DaemonTokenManager()
const dbDriver = new DaemonDatabaseDriver()

// Unauthenticated routes

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/register', async (req, res, next) => {
  try {
    if (!req.headers['X-Secret']) {
      logger.warn(`Received daemon registration request from IP ${req.ip}, but secret was not present in X-Secret header.`)
      res.sendStatus(400)
    } else if (req.headers['X-Secret'] === process.env.SERVER_SECRET) {
      logger.info(`Received daemon registration request from IP ${req.ip}.`)

      const token = tokenManager.generate()
      await dbDriver.insert({ token })
      res.status(200).send({ token })

      logger.info(`Daemon registration for IP ${req.ip} complete.`)
    } else {
      logger.warn(`Received daemon registration request from IP ${req.ip}, but secret was incorrect.`)
      res.sendStatus(401)
    }
  } catch (err) {
    logger.error(`Encountered an error during daemon registration: ${err.stack}`)
    res.sendStatus(500)
  }
})

// Authenticated routes

// TODO: Auth middleware

router.get('/', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.post('/identify', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.get('/:mac', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.delete('/:mac', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.post('/:mac/boot', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.post('/:mac/reboot', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.post('/:mac/shutdown', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.post('/:mac/restart', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

router.post('/:mac/logout', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

export default router
