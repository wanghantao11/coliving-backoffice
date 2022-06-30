import 'reflect-metadata'
import * as winston from 'winston'
const { combine, timestamp, printf, label, colorize, simple } = winston.format
const customizedFormat = printf(({ message, label, timestamp }) =>
  `${timestamp} [${label}]: ${JSON.stringify(message)}`)

winston.loggers.add('error_event', {
  format: combine(
    label({ label: 'error_event' }), timestamp(), colorize(), simple(), customizedFormat),
  transports: [new winston.transports.Console()],
})

const errorEventLogger = winston.loggers.get('error_event')

errorEventLogger.stream = {
  write: (message: any) => {
    errorEventLogger.error(message)
  },
} as any

export { errorEventLogger }
