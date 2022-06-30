import { Room } from './../entity/room'

export interface RoomDao {
  createRoom(room: Room)
  deleteRoom(id: number)
  getRoomBy(filter: any): Promise<Room>
  getRoomsBy(filter: any): Promise<Room[]>
  getRoomStatisticsByClientId(clientId: number)
  getRoomsWithTenantsBy(query: any)
  getRoomsWithTerminatedContractsByFacadeId(facadeId: number)
  updateRoomBy(filter: any, data: Partial<Room>): Promise<Room>
  getUserScoresForTenantsAndCandidatesByRoomIds(ids: number[]): Promise<any>
}
