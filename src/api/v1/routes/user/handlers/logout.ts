import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { ok } from '../../../../../utils/cannedHTTPResponses'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  logger.info(`Invalidating session ${req.session.token}`)
  req.session.destroy(() => {})
  ok(res)
}
