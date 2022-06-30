import { offerEventLogger } from './loggers'
import { IErrorLog } from '../../interfaces'

const errorLogMap = {
  NOT_FOUND: (facade_id, reason, data) => offerEventLogger.info({ type: 'search_failed', data, log: { reason }, facade_id }),
  NOT_ALLOWED: (facade_id, reason, data) => offerEventLogger.info({ type: 'search_failed', data, log: { reason }, facade_id }),
}
export const handleNoOfferException = (facade_id: number) => (error: IErrorLog) =>
  errorLogMap[error.message]
    ? errorLogMap[error.message](facade_id, error.reason, error.data)
    : offerEventLogger.info({ type: 'search_failed', log: error, facade_id })
