import { Offer } from './../entity'
import { IContractData, IOfferFilter } from '../../interfaces'

export interface OfferDao {
  createOffer(offer: Partial<Offer>): Promise<Offer>
  createOffersForPair(
    iduser: string,
    preferred_roommate_iduser: string,
    room_id: number,
    facade_id: number,
    is_preferences_matched: boolean
  ): Promise<Offer>
  getContractDataByRoomIdAndExternalIds(roomId, idusers: string[]): Promise<IContractData[]>
  getOfferBy(filter: IOfferFilter): Promise<Offer>
  getOffersBy(filter: IOfferFilter): Promise<Offer[]>
  getOffersCountBy(filter: IOfferFilter): Promise<number>
  getPendingOfferMembers(query: any)
  updateOfferBy(filter: IOfferFilter, data: Partial<Offer>): Promise<Offer>
  deleteOffersBy(filter: IOfferFilter)
}
