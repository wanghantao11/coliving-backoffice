import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import * as winston from 'winston'
import * as Transport from 'winston-transport'

import { ContractEventsDao } from '../../../domain/dao'
import { ContractEventsRepository } from '../../../domain/repository'

@injectable()
class ContractEventTransport extends Transport {
  constructor(
    @inject('ContractEventsDao') private contractEventsDao: ContractEventsDao) {
    super()
  }

  public log({ message }, callback) {
    const { type, log, data, facade_id, iduser } = message
    this.contractEventsDao.createContractEvent({ iduser, type, data, log, facade_id })
    callback()
  }
}

const { combine, timestamp, printf, label, splat } = winston.format
const customizedFormat = printf(({ message, label, timestamp }) => `${timestamp} [${label}]: ${JSON.stringify(message, null, 2)}`)

const contractEventsDao: ContractEventsDao = new ContractEventsRepository()
const contractEventDBTransport = new ContractEventTransport(contractEventsDao)
const contractEventconsoleTransport = new winston.transports.Console({
  format: combine(label({ label: 'contract_event' }), timestamp(), splat(), customizedFormat),
})

winston.loggers.add('contract_event', {
  transports: [contractEventDBTransport],
})

const contractEventLogger = winston.loggers.get('contract_event')

if (process.env.NODE_ENV !== 'production') {
  contractEventLogger.add(contractEventconsoleTransport)
}

export { contractEventLogger }
