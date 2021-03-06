import crypto from 'crypto'
import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { unauthorized, internalServerError } from '../../../../../utils/cannedHTTPResponses'
import requestWasValid from '../../../../../utils/requestWasValid'
import * as dbDriver from '../../../../../db/driver'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!requestWasValid(req, res)) return

    if (req.headers['x-secret'] === process.env.SERVER_SECRET) {
      logger.info(`Received daemon registration request from IP ${req.ip} for MAC ${req.body.mac}, X-Secret=${req.headers['x-secret']}.`)

      const token = crypto.randomBytes(32).toString('hex')
      const { mac } = req.body

      if (await dbDriver.getByMac(mac, true)) {
        logger.warn(`Received duplicate registration for MAC ${mac}.`)
        res.status(403).json({ reason: 'A daemon with this MAC address already exists' })
      } else {
        await dbDriver.insert({ token, mac })
        res.status(200).json({ token })
        logger.info(`Daemon registration for IP ${req.ip} complete.`)
      }
    } else {
      logger.warn(`Received daemon registration request from IP ${req.ip}, but secret was incorrect (Expected ${process.env.SERVER_SECRET}, got ${req.headers['x-secret']}).`)
      unauthorized(res, 'Invalid secret')
    }
  } catch (err) {
    logger.error(`Encountered an error during daemon registration: ${err.stack}`)
    internalServerError(res)
  }
}
