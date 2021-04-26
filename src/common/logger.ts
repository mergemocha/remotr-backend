import path from 'path'
import { createLogger, transports, format } from 'winston'

const logPath = path.resolve(process.cwd(), 'logs')

global.logger = createLogger({
  level: process.env.NODE_ENV !== 'development' ? 'info' : 'debug',
  format: format.json(),
  transports: [
    new transports.File({ filename: path.join(logPath, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logPath, 'full.log') }),
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) })
  ]
})
