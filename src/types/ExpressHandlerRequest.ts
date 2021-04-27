import { Request } from 'express'

// Had to copy this over here since there is no shorthand type for the type Express uses for the req parameter in request handlers
export type ExpressHandlerRequest = Request<Record<string, any> | undefined, any, any, Record<string, any> | undefined, Record<string, any>>
