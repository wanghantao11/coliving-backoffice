import { OfferEvents } from './../entity'

export interface OfferEventsDao {
  createOfferEvent(offerEvent: OfferEvents)
  deleteOfferEvent(id: number)
  getOfferEvent(id: number)
  getOfferEventsByExternalId(iduser: string)
  getOfferEventsByType(type: string)
  getOfferEventsByDateRange(startDate: string, endDate: string)
  getOfferEventsDetailedByDateRange(startDate: string, endDate: string, facadeId: number)
}
