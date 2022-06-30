import { Room } from './../domain/entity'
import { ROOM_STATUS } from '../infrastructure/constants'

export interface IRoomWithScore extends Room {
  score: number
}

export interface IApartmentScoreWithRooms {
  rooms: IRoomWithScore[]
  apartments: object
}

export interface IRoomFilter {
  id?: number
  ids?: number[]
  facadeId?: number
  apartmentIds?: number[]
  status?: ROOM_STATUS
}
