import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { unauthorized, internalServerError } from '../../../../../utils/cannedHTTPResponses'
import requestWasValid from '../../../../../utils/requestWasValid'
import DaemonTokenManager from '../../../../../auth/DaemonTokenManager'
import DaemonDatabaseDriver from '../../../../../db/drivers/daemon'

const tokenManager = new DaemonTokenManager()
const dbDriver = new DaemonDatabaseDriver()

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
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
}
