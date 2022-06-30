import 'reflect-metadata'
import * as winston from 'winston'
const { combine, timestamp, printf, label, colorize, simple } = winston.format
const customizedFormat = printf(({ message, label, timestamp }) => `${timestamp} [${label}]: ${JSON.stringify(message)}`)

winston.loggers.add('general_event', {
  format: combine(label({ label: 'general_event' }), timestamp(), colorize(), simple(), customizedFormat),
  transports: [new winston.transports.Console()],
})

const logger = winston.loggers.get('general_event')

logger.stream = {
  write: (message: any) => {
    logger.info(message)
  },
} as any

if (process.env.NODE_ENV !== 'production') {
  logger.info('Logging initialized at debug level')
}

export { logger }
