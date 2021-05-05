import { NextFunction, Response } from 'express'
import Daemon, { DaemonDocument } from '../../../../../types/Daemon'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { internalServerError } from '../../../../../utils/cannedHTTPResponses'
import * as dbDriver from '../../../../../db/driver'
import stripDaemon from '../../../../../utils/stripDaemon'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Strip extraneous and sensitive data from daemons before sending it downstream
    const daemons = (await dbDriver.getAll(true))
      .filter((daemon: DaemonDocument) => daemon.ip) // Don't send daemons that have not yet identified
      .map((daemon: DaemonDocument) => {
        const tempDaemon = daemon as unknown // TypeScript hack to downgrade DaemonDocument into a Daemon
        return stripDaemon(tempDaemon as Daemon)
      })

    res.status(200).json(daemons)
  } catch (err) {
    logger.error(`Encountered an error while sending all daemons: ${err.stack}`)
    internalServerError(res)
  }
}
