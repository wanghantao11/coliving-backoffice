import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import * as winston from 'winston'
import * as Transport from 'winston-transport'
import * as httpContext from 'express-http-context'

import { OfferEventsDao } from '../../../domain/dao'
import { OfferEventsRepository } from '../../../domain/repository'

@injectable()
class OfferEventTransport extends Transport {
  constructor(
    @inject('OfferEventsDao') private offerEventsDao: OfferEventsDao) {
    super()
  }

  public log({ message }, callback) {
    const { type, log, data, facade_id } = message
    const iduser = httpContext.get('iduser')
    if (iduser && type) {
      this.offerEventsDao.createOfferEvent({ iduser, type, data, log, facade_id })
    }
    callback()
  }
}

const { combine, timestamp, printf, label, splat } = winston.format
const offerEventsDao: OfferEventsDao = new OfferEventsRepository()
const customizedFormat = printf(({ message, label, timestamp }) => `${timestamp} [${label}]: ${JSON.stringify(message, null, 2)}`)

const offerEventDBTransport = new OfferEventTransport(offerEventsDao)
const offerEventconsoleTransport = new winston.transports.Console({
  format: combine(label({ label: 'offer_event' }), timestamp(), splat(), customizedFormat),
})

winston.loggers.add('offer_event', {
  transports: [offerEventDBTransport],
})

const offerEventLogger = winston.loggers.get('offer_event')

if (process.env.NODE_ENV !== 'production') {
  offerEventLogger.add(offerEventconsoleTransport)
}

export { offerEventLogger }
