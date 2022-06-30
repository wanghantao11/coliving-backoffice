import { UserScore } from '../domain/entity'

export interface ITenantWithScore extends UserScore {
  apartment_id: number
  room_id: number
}
