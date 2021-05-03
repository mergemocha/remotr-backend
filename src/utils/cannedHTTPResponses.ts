import { Response } from 'express'

/**
 * Terminates a request with status code 200, default message field and optional detail string.
 *
 * @param res - Express response object.
 * @param detail - Optional string or object with extra details.
 */
export function ok (res: Response, detail?: string | { [key: string]: any }): void {
  res.status(200).json({ message: 'OK', detail })
}

/**
 * Terminates a request with status code 400, default message field and optional detail string.
 *
 * @param res - Express response object.
 * @param detail - Optional string or object with extra details.
 */
export function badRequest (res: Response, detail?: string | { [key: string]: any }): void {
  res.status(400).json({ message: 'Bad Request', detail })
}

/**
 * Terminates a request with status code 401, default message field and optional detail string.
 *
 * @param res - Express response object.
 * @param detail - Optional string or object with extra details.
 */
export function unauthorized (res: Response, detail?: string | { [key: string]: any }): void {
  res.status(401).json({ message: 'Unauthorized', detail })
}

/**
 * Terminates a request with status code 404, default message field and optional detail string.
 *
 * @param res - Express response object.
 * @param detail - Optional string or object with extra details.
 */
export function notFound (res: Response, detail?: string | { [key: string]: any }): void {
  res.status(404).json({ message: 'Not Found', detail })
}

/**
 * Terminates a request with status code 500, default message field and optional detail string.
 *
 * @param res - Express response object.
 * @param detail - Optional string or object with extra details.
 */
export function internalServerError (res: Response, detail?: string | { [key: string]: any }): void {
  res.status(500).json({ message: 'Internal Server Error', detail })
}

/**
 * Terminates a request with status code 555, default message field and optional detail string.
 *
 * @param res - Express response object.
 * @param detail - Optional string or object with extra details.
 */
export function daemonReturnedError (res: Response, detail?: string | { [key: string]: any }): void {
  res.status(555).json({ message: 'Daemon Returned Error', detail })
}
