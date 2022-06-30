import * as dotenv from 'dotenv'
dotenv.config()

import { container } from './../src/container'
import { TypeORMConnectionService } from './../src/infrastructure/persistence/typeorm/service'
import { logger } from '../src/infrastructure/utils/loggers'

const db: TypeORMConnectionService = container.get('TypeORMConnectionService')

db.startConn()
  .then(() => logger.info('Connected to db.'))
  .catch(reason => logger.error(`Error when connecting to db! ${reason}`))

export { db }
