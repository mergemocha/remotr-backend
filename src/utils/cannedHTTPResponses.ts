import { Response } from 'express'

export function ok (res: Response, detail?: string): void {
  res.status(200).json({ message: 'OK', detail })
}

export function unauthorized (res: Response, detail?: string): void {
  res.status(401).json({ message: 'Unauthorized', detail })
}

export function notFound (res: Response, detail?: string): void {
  res.status(404).json({ message: 'Not Found', detail })
}

export function internalServerError (res: Response, detail?: string): void {
  res.status(500).json({ message: 'Internal Server Error', detail })
}
