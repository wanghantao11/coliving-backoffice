import { UserPreferences } from './../domain/entity'
import { OFFER_STATUS } from '../infrastructure/constants'

export interface IOfferRequest {
  iduser: string
  preferred_roommate_iduser: string
  facade_id: number
  preferences: Partial<UserPreferences>
}

export interface IOfferFilter {
  id?: number
  iduser?: string
  roomId?: number
  status?: OFFER_STATUS
  is_sent_by_admin?: boolean
  facade_id?: number
}

export interface IManualOfferInfo {
  iduser: string
  is_preferences_matched: boolean
  matching_score?: number
}
