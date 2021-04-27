import { Router } from 'express'
import { header, body, param } from 'express-validator'
import DaemonTokenManager from '../../../auth/DaemonTokenManager'
import DaemonDatabaseDriver from '../../../db/drivers/daemon'
import { ok, unauthorized, notFound, internalServerError } from '../../../utils/cannedHTTPResponses'
import requestWasValid from '../../../utils/requestWasValid'

const router = Router()

const tokenManager = new DaemonTokenManager()
const dbDriver = new DaemonDatabaseDriver()

// Registration routes with special authentication

router.post(
  '/register',
  header('X-Secret').isString().withMessage('X-Secret header must be present'),
  async (req, res, next) => {
    try {
      if (!requestWasValid(req, res)) return

      if (req.headers['x-secret'] === process.env.SERVER_SECRET) {
        logger.info(`Received daemon registration request from IP ${req.ip}, X-Secret=${req.headers['x-secret']}.`)

        const token = tokenManager.generate()
        await dbDriver.insert({ token })
        res.status(200).json({ token })

        logger.info(`Daemon registration for IP ${req.ip} complete.`)
      } else {
        logger.warn(`Received daemon registration request from IP ${req.ip}, but secret was incorrect (Expected ${process.env.SERVER_SECRET}, got ${req.headers['x-secret']}).`)
        unauthorized(res, 'Invalid secret')
      }
    } catch (err) {
      logger.error(`Encountered an error during daemon registration: ${err.stack}`)
      internalServerError(res)
    }
  })

router.post(
  '/identify',
  header('Authorization').isString().withMessage('Authorization header must be present'),
  body('mac').isMACAddress().withMessage('Must be a MAC address'),
  body('ip').isIP().withMessage('Must be an IP address'),
  body('user').isString().withMessage('Must be present'),
  body('hostname').isString().withMessage('Must be present'),
  async (req, res, next) => {
    try {
      if (!requestWasValid(req, res)) return

      logger.info(`Received daemon identification request from IP ${req.ip}: token=${req.headers.authorization}, MAC=${req.body.mac}, IP=${req.body.ip}, user=${req.body.user}, hostname=${req.body.hostname}`)

      const daemon = await dbDriver.getByToken(req.headers.authorization)

      if (daemon !== null) {
        const { mac, ip, user, hostname }: { mac: string, ip: string, user: string, hostname: string } = req.body

        daemon.mac = mac
        daemon.ip = ip
        daemon.user = user
        daemon.hostname = hostname

        await daemon.save()

        ok(res)
        logger.info(`Daemon identification for daemon ${req.body.mac} complete.`)
      } else {
        logger.warn(`Received daemon identification request from IP ${req.ip}, but token was incorrect (token=${req.headers.authorization}).`)
        unauthorized(res, 'Invalid token')
      }
    } catch (err) {
      logger.error(`Encountered an error during daemon identification: ${err.stack}`)
      internalServerError(res)
    }
  })

// Authenticated routes

// TODO: Auth middleware

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await dbDriver.getAll(true))
  } catch (err) {
    logger.error(`Encountered an error when sending all daemons: ${err.stack}`)
    internalServerError(res)
  }
})

router.get(
  '/:mac',
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  async (req, res, next) => {
    try {
      if (!requestWasValid(req, res)) return
      res.status(200).json(await dbDriver.getByMac(req.params?.mac, true))
    } catch (err) {
      logger.error(`Encountered an error when sending daemon ${req.params?.mac}: ${err.stack}`)
      internalServerError(res)
    }
  })

router.delete(
  '/:mac',
  header('Authorization').isString().withMessage('Authorization header must be present'),
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  async (req, res, next) => {
    try {
      if (!requestWasValid(req, res)) return

      logger.info(`Received daemon deletion request from IP ${req.ip}: daemon=${req.params?.mac}, token=${req.headers.authorization}.`)

      const daemon = await dbDriver.getByMac(req.params?.mac)

      if (daemon === null) {
        logger.warn(`Received daemon deletion request from IP ${req.ip} for non-existent daemon ${req.params?.mac}.`)
        notFound(res, 'No daemon with this MAC address found')
      } else if (daemon.token !== req.headers.authorization) {
        logger.warn(`Received daemon deletion request from IP ${req.ip} for daemon ${req.params?.mac}, but token was incorrect (Expected ${daemon.token}, got ${req.headers.authorization}).`)
        unauthorized(res, 'Invalid token')
      } else {
        await dbDriver.delete(daemon)
        ok(res, 'De-registration successful')
        logger.info(`Daemon de-registration for daemon ${req.params?.mac} complete.`)
      }
    } catch (err) {
      logger.error(`Encountered an when de-registering daemon ${req.params?.mac}: ${err.stack}`)
      internalServerError(res)
    }
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
