import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../../types/ExpressHandlerRequest'
import { genericOpHandler } from '../../utils'

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => void genericOpHandler({ opCode: 'shutdown', req, res })
