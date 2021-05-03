import path from 'path'
import { createLogger, transports, format } from 'winston'
import TransportStream from 'winston-transport'

const logPath = path.resolve(process.cwd(), 'logs')
const isDev = process.env.NODE_ENV === 'development'

const logTransports: TransportStream[] = [
  new transports.Console({ format: format.combine(format.colorize(), format.simple()) })
]

if (!isDev) {
  [
    new transports.File({ filename: path.join(logPath, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logPath, 'full.log') })
  ].forEach(transport => logTransports.push(transport))
}

global.logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: format.json(),
  transports: logTransports
})
