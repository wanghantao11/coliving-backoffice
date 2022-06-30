import * as Queue from 'bull'
import config from './../../../../config/app-config'
import { logger } from '../../utils/loggers'

export const OfferQueue = new Queue('offer', config.REDIS_URL)

OfferQueue.on('completed', data => {
  logger.info({ type: 'job_complete', data })
})

OfferQueue.on('failed', data => {
  logger.info({ type: 'job_failed', data })
})
