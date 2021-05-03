import { Response } from 'express'
import { validationResult } from 'express-validator'
import { ExpressHandlerRequest } from '../types/ExpressHandlerRequest'

/**
 * Checks if parameters to a request in Express passed validation,
 * terminating by sending status 400 if not.
 */
export default (req: ExpressHandlerRequest, res: Response): boolean => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return false
  } else {
    return true
  }
}
